import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Sparkles,
  Upload,
  X,
  Video,
  Link as LinkIcon,
  Mail,
  Phone,
  User,
  MessageSquare,
  Palette,
  Ruler,
  Gem,
  Send,
  CheckCircle,
  AlertCircle,
  DollarSign,
  PenTool,
} from "lucide-react";
import AnimatedSection from "../components/home/AnimatedSection";
import CustomDropdown from "../components/CustomDropdown";
import api from "../services/api";
import { API_METHOD } from "../services/apiMethod";
import toast from "react-hot-toast";
import { fetchMetals, selectMetals, selectMetalsLoading } from "../store/slices/metalsSlice";
import { fetchStones, selectStones, selectStonesLoading } from "../store/slices/stonesSlice";
import { TIMELINE_OPTIONS, transformMetalsToDropdownOptions, transformStonesToDropdownOptions } from "../constants";
import FormInput from "../components/FormInput";
import CategoryHero from "../components/CategoryHero";
import customHeroBg from "../assets/images/summar.webp";
const Custom = () => {
  const dispatch = useDispatch();
  const metals = useSelector(selectMetals);
  const metalsLoading = useSelector(selectMetalsLoading);
  const stones = useSelector(selectStones);
  const stonesLoading = useSelector(selectStonesLoading);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    designDescription: "",
    preferredMetal: "",
    preferredStone: "",
    budget: "",
    timeline: "",
    size: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [mediaUrls, setMediaUrls] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch metals and stones when component mounts
  useEffect(() => {
    // dispatch(fetchMetals());
    // dispatch(fetchStones({ page: 1, limit: 100 })); // Fetch more stones for dropdown
  }, [dispatch]);
  const stepsData = [
    {
      id: 1,
      title: "Submit Your Request",
      description:
        "Fill out the form with your design ideas, preferences, and any reference images",
    },
    {
      id: 2,
      title: "Design Consultation",
      description:
        "Our expert designers will review your request and contact you within 24-48 hours",
    },
    {
      id: 3,
      title: "Creation & Delivery",
      description:
        "Once approved, our master craftsmen will create your unique piece",
    },
  ];
  
  // Transform metals to dropdown options (only active metals and purity levels)
  // Each purity level becomes a separate option with format "18K Gold", "22K Gold", etc.
  const metalOptions = transformMetalsToDropdownOptions(metals);

  // Transform stones to dropdown options (only active stones)
  const stoneOptions = transformStonesToDropdownOptions(stones);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Full name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Please enter a valid email address";
        }
        break;

      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^[+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-()]/g, ""))) {
          error = "Please enter a valid phone number";
        }
        break;

      case "message":
        if (!value.trim()) {
          error = "Design Description is required";
        } else if (value.trim().length < 10) {
          error = "Design Description must be at least 10 characters";
        }
        break;

      case "designDescription":
        if (value.trim() && value.trim().length < 10) {
          error = "Additional message must be at least 10 characters";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["name", "email", "phone", "message"];

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Validate optional fields if they have values
    if (formData.designDescription.trim()) {
      const error = validateField("designDescription", formData.designDescription);
      if (error) {
        newErrors.designDescription = error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    const error = validateField(name, value);
    if (error) {
      setErrors({
        ...errors,
        [name]: error,
      });
    }
  };

  const processFiles = (files) => {
    const fileArray = Array.from(files);
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/svg+xml', 'image/tiff', 'image/x-icon', 'image/heic', 'image/heif'];
    const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/x-matroska', 'video/x-flv', 'video/x-ms-wmv', 'video/3gpp', 'video/ogg', 'video/mpeg'];
    const maxFileSize = 100 * 1024 * 1024;
    const maxFiles = 20;

    const validFiles = fileArray.filter(file => {
      const isValidType = allowedImageTypes.includes(file.type) || allowedVideoTypes.includes(file.type);
      const isValidSize = file.size <= maxFileSize;

      if (!isValidType) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum file size is 100MB`);
        return false;
      }
      return true;
    });

    if (selectedFiles.length + validFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setSelectedFiles([...selectedFiles, ...validFiles]);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the drop zone itself, not a child element
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;

    try {
      new URL(urlInput.trim());
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    if (mediaUrls.some(item => item.url === urlInput.trim())) {
      toast.error('This URL has already been added');
      return;
    }

    const detectMediaType = (url) => {
      const urlLower = url.toLowerCase();
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.svg', '.tiff', '.ico', '.heic', '.heif'];
      const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv', '.wmv', '.m4v', '.3gp', '.ogv', '.mpeg', '.mpg'];

      if (imageExtensions.some(ext => urlLower.includes(ext))) return 'image';
      if (videoExtensions.some(ext => urlLower.includes(ext))) return 'video';
      if (urlLower.includes('image') || urlLower.includes('img') || urlLower.includes('photo') || urlLower.includes('picture')) return 'image';
      if (urlLower.includes('video') || urlLower.includes('youtube') || urlLower.includes('vimeo') || urlLower.includes('stream')) return 'video';
      return 'image';
    };

    const mediaType = detectMediaType(urlInput.trim());
    setMediaUrls([...mediaUrls, { type: mediaType, url: urlInput.trim() }]);
    setUrlInput("");
    setShowUrlInput(false);
  };

  const removeUrl = (index) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
  };

  const isImageFile = (file) => file.type.startsWith('image/');
  const isVideoFile = (file) => file.type.startsWith('video/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!validateForm()) {
      setSubmitStatus("error");
      window.scrollTo({ top: 450, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('phone', formData.phone.trim());
      formDataToSend.append('message', formData.message.trim());
      formDataToSend.append('service', 'custom');
      
      // Add optional custom order fields
      if (formData.designDescription) {
        formDataToSend.append('designDescription', formData.designDescription.trim());
      }
      if (formData.preferredMetal) {
        formDataToSend.append('preferredMetal', formData.preferredMetal.trim());
      }
      if (formData.preferredStone) {
        formDataToSend.append('preferredStone', formData.preferredStone.trim());
      }
      if (formData.budget) {
        formDataToSend.append('budget', formData.budget.trim());
      }
      if (formData.timeline) {
        formDataToSend.append('timeline', formData.timeline.trim());
      }
      if (formData.size) {
        formDataToSend.append('size', formData.size.trim());
      }

      selectedFiles.forEach((file) => {
        formDataToSend.append('media', file);
      });

      if (mediaUrls.length > 0) {
        formDataToSend.append('mediaUrls', JSON.stringify(mediaUrls));
      }

      // Don't set Content-Type header - let axios set it automatically for FormData
      await api.post(API_METHOD.contacts, formDataToSend);

      setSubmitStatus("success");
      toast.success('Custom order request submitted successfully!');
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        designDescription: "",
        preferredMetal: "",
        preferredStone: "",
        budget: "",
        timeline: "",
        size: "",
      });
      setSelectedFiles([]);
      setMediaUrls([]);
      setUrlInput("");
      setShowUrlInput(false);
      setErrors({});
    } catch (error) {
      console.error("Error submitting custom order:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit request. Please try again.";
      setErrors({ submit: errorMessage });
      setSubmitStatus("error");
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <CategoryHero
        // eyebrow="JEWELRY COLLECTION"
        title="Custom Design"
        highlightedWord="."
        body="Create your dream piece of jewelry with our expert craftsmen. Share your vision and we'll bring it to life."
        backgroundImage={customHeroBg}
        backgroundOverlay="rgba(0,0,0,0.22)"
        icon={<Sparkles className="w-10 h-10 text-white" />}
      />
      {/* <AnimatedSection animationType="fadeInUp" delay={100}>
        <section className="relative bg-gradient-to-br from-primary via-primary-light to-primary-dark py-20">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-sorts-mill-gloudy text-white mb-6">
              Custom Design<span className="text-primary-light">.</span>
            </h1>
            <p className="text-xl md:text-2xl font-montserrat-regular-400 text-white/90 max-w-3xl mx-auto mb-8">
              Create your dream piece of jewelry with our expert craftsmen. 
              Share your vision and we'll bring it to life.
            </p>
            <div className="w-24 h-1 bg-white mx-auto"></div>
          </div>
        </section>
      </AnimatedSection> */}

      {/* Custom Order Form */}
      <AnimatedSection animationType="fadeInUp" delay={200}>
        <section className="py-10 sm:py-10 bg-secondary">
          <div className="max-w-5xl mx-auto sm:px-6 px-4">
            <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 md:p-12">
              {/* Status Messages */}
              {submitStatus === "success" && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-green-800 font-montserrat-semibold-600 text-lg mb-2">
                        Request Submitted Successfully!
                      </h3>
                      <p className="text-green-700 font-montserrat-regular-400">
                        Thank you for your custom order request. Our team will review your submission 
                        and get back to you within 24-48 hours. We're excited to work with you!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
                  <div className="flex items-start">
                    <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-red-800 font-montserrat-semibold-600 text-lg mb-2">
                        Submission Failed
                      </h3>
                      <p className="text-red-700 font-montserrat-regular-400">
                        {errors.submit || "Please fix the errors below and try again."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-6 flex items-center">
                    <User className="w-6 h-6 mr-2 text-primary" />
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <FormInput
                        label="Full Name *"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={errors.name}
                        icon={User}
                        placeholder="Enter your full name"
                      />                      
                    </div>

                    <div>
                      <FormInput
                        label="Phone Number *"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        error={errors.phone}
                        icon={Phone}
                        placeholder="Enter your phone number"
                      />

                    </div>

                    <div className="md:col-span-2">
                      <FormInput
                        label="Email Address *"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={errors.email}
                        icon={Mail}
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                </div>

                {/* Design Details */}
                <div>
                  <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-4 flex items-center">
                    <Palette className="w-6 h-6 mr-2 text-primary" />
                    Design Details
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <FormInput
                        // label="Design Description *"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                          error={errors.message}
                        icon={PenTool}
                        textarea={true}
                        rows={5}
                        placeholder="Enter your design description"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                          Preferred Metal
                        </label>
                        <CustomDropdown
                          options={metalOptions}
                          value={formData.preferredMetal}
                          onChange={(value) => {
                            setFormData({
                              ...formData,
                              preferredMetal: value
                            });
                            if (errors.preferredMetal) {
                              setErrors({
                                ...errors,
                                preferredMetal: ""
                              });
                            }
                          }}
                          placeholder="Select metal"
                          searchable={true}
                          disabled={metalsLoading}
                        />
                        {metalsLoading && (
                          <p className="mt-1 text-xs text-black-light font-montserrat-regular-400">
                            Loading metals...
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                          Preferred Stone
                        </label>
                        <CustomDropdown
                          options={stoneOptions}
                          value={formData.preferredStone}
                          onChange={(value) => {
                            setFormData({
                              ...formData,
                              preferredStone: value
                            });
                            if (errors.preferredStone) {
                              setErrors({
                                ...errors,
                                preferredStone: ""
                              });
                            }
                          }}
                          placeholder="Select stone"
                          searchable={true}
                          disabled={stonesLoading}
                        />
                        {stonesLoading && (
                          <p className="mt-1 text-xs text-black-light font-montserrat-regular-400">
                            Loading stones...
                          </p>
                        )}
                      </div>

                      <div>
                        <FormInput
                          label="Budget Range"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          error={errors.budget}
                          icon={DollarSign}
                          placeholder="e.g., $500 - $1000"
                        />
                      </div>

                      <div>
                      <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                          Timeline
                        </label>
                        <CustomDropdown
                          options={TIMELINE_OPTIONS}
                          value={formData.timeline}
                          onChange={(value) => {
                            setFormData({
                              ...formData,
                              timeline: value
                            });
                          }}
                          placeholder="Select timeline"
                          searchable={true}
                          disabled={false}

                        />  
                        
                      </div>

                      <div className="md:col-span-2">
                        <FormInput
                          label="Size/Measurements"
                          name="size"
                          value={formData.size}
                          onChange={handleInputChange}
                          error={errors.size}
                          icon={Ruler}
                          placeholder="e.g., Ring size 7, Necklace length 18 inches"
                        />
                        
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Message */}
                <div>
                  <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-4 flex items-center">
                    <MessageSquare className="w-6 h-6 mr-2 text-primary" />
                    Additional Message
                  </h2>
                  <FormInput
                    // label="Additional Message *"
                    name="designDescription"
                    value={formData.designDescription}
                    onChange={handleInputChange}
                    error={errors.designDescription}
                    icon={MessageSquare}
                    textarea={true}
                    rows={6}
                    placeholder="Tell us more about your custom order request..."
                  />
                  
                </div>

                {/* Media Upload Section */}
                <div>
                  <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-6 flex items-center">
                    <Gem className="w-6 h-6 mr-2 text-primary" />
                    Reference Images/Videos
                  </h2>
                  
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(false)}
                      className={`flex-1 py-2 px-4 rounded-lg font-montserrat-medium-500 transition-colors sm:text-lg text-sm ${
                        !showUrlInput
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-black hover:bg-gray-300'
                      }`}
                    >
                      <Upload className="w-4 h-4 inline mr-2" />
                      Upload Files
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(true)}
                      className={`flex-1 py-2 px-4 rounded-lg font-montserrat-medium-500 transition-colors sm:text-lg text-sm ${
                        showUrlInput
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-black hover:bg-gray-300'
                      }`}
                    >
                      <LinkIcon className="w-4 h-4 inline mr-2" />
                      Add URLs
                    </button>
                  </div>

                  {!showUrlInput && (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
                        isDragging
                          ? 'border-primary bg-primary/5 scale-[1.02]'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      <input
                        type="file"
                        id="media"
                        name="media"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="media"
                        className="cursor-pointer flex flex-col items-center justify-center"
                      >
                        <Upload className={`w-12 h-12 mb-4 transition-colors ${
                          isDragging ? 'text-primary' : 'text-gray-400'
                        }`} />
                        <p className={`text-sm font-montserrat-medium-500 mb-2 transition-colors ${
                          isDragging ? 'text-primary' : 'text-black'
                        }`}>
                          {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs font-montserrat-regular-400 text-black-light text-center">
                          Upload reference images or videos (Max 20 files, 100MB per file)
                        </p>
                      </label>
                    </div>
                  )}

{showUrlInput && (
  <div className="space-y-3 px-0 sm:px-0">
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        type="url"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addUrl();
          }
        }}
        placeholder="Paste image or video URL here..."
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none font-montserrat-regular-400 w-full"
      />
      <button
        type="button"
        onClick={addUrl}
        className="w-full sm:w-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-montserrat-medium-500"
      >
        Add URL
      </button>
    </div>
  </div>
)}


                  {selectedFiles.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-montserrat-medium-500 text-black mb-3">
                        Uploaded Files ({selectedFiles.length}/20):
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="relative border border-gray-300 rounded-lg overflow-hidden group"
                          >
                            {isImageFile(file) ? (
                              <div className="aspect-square bg-gray-100">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : isVideoFile(file) ? (
                              <div className="aspect-square bg-gray-100 relative">
                                <video
                                  src={URL.createObjectURL(file)}
                                  className="w-full h-full object-cover"
                                  muted
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                  <Video className="w-8 h-8 text-white" />
                                </div>
                              </div>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                              {file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {mediaUrls.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-montserrat-medium-500 text-black mb-3">
                        Media URLs ({mediaUrls.length}):
                      </p>
                      <div className="space-y-2">
                        {mediaUrls.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg group"
                          >
                            <div className="flex-1 min-w-0 flex flex-col">
                              <p className="text-xs font-montserrat-medium-500 text-black truncate">
                                {item.type === 'image' ? '🖼️ Image' : '🎥 Video'}
                              </p>
                              <p className="text-xs font-montserrat-regular-400 text-black-light truncate">
                                {item.url}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeUrl(index)}
                              className="bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full outline-none font-montserrat-semibold-600 py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 sm:text-lg text-sm ${
                    isSubmitting
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Custom Order Request</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Info Section */}
      <AnimatedSection animationType="fadeInUp" delay={300}>
      <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto sm:px-6 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-sorts-mill-gloudy text-black mb-6">
            How It Works
          </h2>
          <p className="text-lg font-montserrat-regular-400 text-black-light max-w-2xl mx-auto">
            Our custom design process is simple and collaborative
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 sm:gap-8 gap-4">
          {stepsData.map((step) => (
            <div key={step.id} className="text-center sm:p-6 p-0">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">{step.id}</span>
              </div>
              <h3 className="text-xl font-montserrat-semibold-600 text-black mb-3">
                {step.title}
              </h3>
              <p className="text-black-light font-montserrat-regular-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
      </AnimatedSection>
    </div>
  );
};

export default Custom;

