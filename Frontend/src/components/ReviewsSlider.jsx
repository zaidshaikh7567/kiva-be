import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Star,
  Send,
  User,
  Calendar,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Mail,
  MessageSquare,  
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  selectReviews,
  fetchReviews,
  addReview,
  selectReviewsLoading,
  selectReviewsSubmitting,
  clearSuccess,
} from "../store/slices/reviewsSlice";
import { selectAuthUser } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import FormInput from "./FormInput";
import IconButton from "./IconButton";

const ReviewsSlider = () => {
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);
  const loading = useSelector(selectReviewsLoading);
  const submitting = useSelector(selectReviewsSubmitting);
  const user = useSelector(selectAuthUser);

  const reviewSectionRef = useRef(null);
  const isScrollingRef = useRef(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, setSliderRef] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [mediaViewer, setMediaViewer] = useState({
    open: false,
    item: null
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });

  const MAX_MEDIA_ITEMS = 10;
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [isDraggingMedia, setIsDraggingMedia] = useState(false);
  const [errors, setErrors] = useState({});
  const latestMediaPreviewsRef = useRef([]);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  useEffect(() => {
    latestMediaPreviewsRef.current = mediaPreviews;
  }, [mediaPreviews]);

  useEffect(() => {
    return () => {
      latestMediaPreviewsRef.current.forEach((preview) => {
        if (preview?.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (showReviewForm) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [showReviewForm]);

  // Check if URL has #reviews hash and scroll to reviews section
  useEffect(() => {
    if (window.location.hash === "#reviews") {
      isScrollingRef.current = true;
      setTimeout(() => {
        const element = reviewSectionRef.current;
        if (element) {
          // Calculate responsive offset based on screen size
          const isMobile = window.innerWidth < 640;
          const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
          const yOffset = isMobile ? -60 : isTablet ? -80 : 400;
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({
            top: y,
            behavior: "smooth",
          });

          // Reset scrolling flag after scroll completes
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 1200);
        }
      }, 500);
    }
  }, []);

  // Add intersection observer to update URL when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Don't update URL during programmatic scrolling
          if (isScrollingRef.current) {
            return;
          }

          if (entry.isIntersecting) {
            // Update URL with #reviews hash when section is visible
            if (window.location.hash !== "#reviews") {
              window.history.replaceState(null, "", "#reviews");
            }
          } else {
            // Remove #reviews from URL when section is not visible
            if (window.location.hash === "#reviews") {
              window.history.replaceState(null, "", window.location.pathname);
            }
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of section is visible
        rootMargin: "-80px 0px", // Negative margin to account for header/nav (responsive)
      }
    );

    const currentRef = reviewSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Display mock reviews if no reviews exist
  const displayReviews =
    reviews.length > 0
      ? reviews
      : [
          // {
          //   _id: "1",
          //   name: "Emily Johnson",
          //   rating: 5,
          //   comment:
          //     "Absolutely stunning jewelry! The craftsmanship is exceptional and the customer service was outstanding.",
          //   createdAt: new Date(Date.now() - 259200000).toISOString(),
          // },
          // {
          //   _id: "2",
          //   name: "Michael Chen",
          //   rating: 5,
          //   comment:
          //     "I ordered a custom ring for my wife and it exceeded all expectations. Highly recommend!",
          //   createdAt: new Date(Date.now() - 86400000).toISOString(),
          // },
          // {
          //   _id: "3",
          //   name: "Sarah Williams",
          //   rating: 4,
          //   comment:
          //     "Fast shipping, gorgeous pieces, and attention to detail. Will definitely order again.",
          //   createdAt: new Date(Date.now() - 172800000).toISOString(),
          // },
        ];

  // Custom arrow components
  const NextArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary/90 hover:bg-primary-dark text-primary sm:p-3 p-1 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
        aria-label="Next review"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary/90 hover:bg-primary-dark text-primary sm:p-3 p-1 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
        aria-label="Previous review"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
    );
  };

  // Custom Dot Component
  const CustomDot = ({ index }) => {
    const isActive = currentSlide === index;
    return (
      <button
        type="button"
        onClick={() => sliderRef?.slickGoTo(index)}
        className={`transition-all duration-300 ${
          isActive ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
        } h-2 rounded-full`}
        aria-label={`Go to slide ${index + 1}`}
      />
    );
  };

  // Slider settings
  const sliderSettings = {
    dots: false, // Hide default dots - we'll add custom ones
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    cssEase: "ease-in-out",
    ref: setSliderRef,
    beforeChange: (_current, next) => {
      setCurrentSlide(next);
    },
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const processMediaFiles = (files) => {
    if (!files || files.length === 0) return;

    const availableSlots = MAX_MEDIA_ITEMS - mediaFiles.length;
    if (availableSlots <= 0) {
      setErrors((prev) => ({
        ...prev,
        media: `You can upload up to ${MAX_MEDIA_ITEMS} files.`,
      }));
      return;
    }

    const selectedFiles = Array.from(files).slice(0, availableSlots);

    const validFiles = [];
    const generatedPreviews = [];
    let errorMessage = "";

    selectedFiles.forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        errorMessage = "Please upload only image or video files.";
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        errorMessage = "Each file must be 50MB or less.";
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      validFiles.push(file);
      generatedPreviews.push({
        url: previewUrl,
        type: isVideo ? "video" : "image",
        name: file.name,
      });
    });

    if (Array.from(files).length > availableSlots) {
      errorMessage = `You can upload up to ${MAX_MEDIA_ITEMS} files.`;
    }

    if (validFiles.length) {
      setMediaFiles((prev) => [...prev, ...validFiles]);
      setMediaPreviews((prev) => [...prev, ...generatedPreviews]);
    }

    setErrors((prev) => ({
      ...prev,
      media: errorMessage,
    }));
  };

  const handleMediaChange = (event) => {
    processMediaFiles(event.target.files);
    event.target.value = "";
  };

  const handleRemoveMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed?.url) {
        URL.revokeObjectURL(removed.url);
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, media: "" }));
  };

  const clearMediaState = () => {
    mediaPreviews.forEach((preview) => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }
    });
    setMediaFiles([]);
    setMediaPreviews([]);
    setIsDraggingMedia(false);
    setErrors((prev) => ({ ...prev, media: "" }));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingMedia(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingMedia(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingMedia(false);

    if (event.dataTransfer?.files?.length) {
      processMediaFiles(event.dataTransfer.files);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "Comment is required";
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = "Comment must be at least 10 characters";
    }

    if (errors.media) {
      newErrors.media = errors.media;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("email", formData.email.trim());
    payload.append("comment", formData.comment.trim());
    payload.append("rating", rating);

    if (user?._id) {
      payload.append("userId", user._id);
    }

    if (mediaFiles.length) {
      mediaFiles.forEach((file) => {
        payload.append("media", file);
      });
    }

    const result = await dispatch(addReview(payload));

    if (addReview.fulfilled.match(result)) {
      toast.success("Review submitted successfully!");
      setShowReviewForm(false);
      setFormData({ name: "", email: "", comment: "" });
      setRating(5);
      clearMediaState();
      setErrors({});
      dispatch(clearSuccess());
    } else {
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const handleCloseForm = () => {
    setShowReviewForm(false);
    setFormData({ name: "", email: "", comment: "" });
    setRating(5);
    clearMediaState();
    setErrors({});
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    const currentUrl =
      window.location.origin + window.location.pathname + "#reviews";

    // Try to use native share API if available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out these customer reviews!",
          text: "See what our clients are saying about Kiva Diamond",
          url: currentUrl,
        });
      } catch {
        // User cancelled or error occurred, fall back to copy
        copyToClipboard(currentUrl);
      }
    } else {
      // Fallback: copy to clipboard
      copyToClipboard(currentUrl);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      toast.success("Review link copied to clipboard!");
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div
      id="reviews"
      ref={reviewSectionRef}
      className="relative bg-gradient-to-br from-primary-light via-white to-secondary py-12 sm:py-16 md:py-20 px-4 sm:px-6 scroll-mt-[100px] sm:scroll-mt-[120px] md:scroll-mt-[140px]"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 relative">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sorts-mill-gloudy font-bold text-black">
              What Our Clients Say
            </h2>
            <button
              onClick={handleShare}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 text-primary hover:text-primary-dark relative z-10"
              title="Share reviews"
              aria-label="Share this review section"
            >
              {shareCopied ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              ) : (
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
          <p className="text-sm sm:text-base md:text-lg font-montserrat-regular-400 text-black-light max-w-2xl mx-auto px-4">
            Don't just take our word for it - hear from our satisfied clients
          </p>
          <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mt-4"></div>
        </div>

        {/* Reviews Slider */}
        {!loading && displayReviews.length > 0 && (
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
            <div className="relative bg-white shadow-xl sm:shadow-2xl rounded-xl sm:rounded-2xl py-8 sm:py-12 md:py-16">
              <Slider {...sliderSettings}>
                {displayReviews.map((review, index) => (
                  <div
                    key={review._id || index}
                    className="min-w-full flex items-center justify-center"
                  >
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-8">
                      {/* Stars */}
                      <div className="flex justify-center space-x-1 mb-4 sm:mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Comment */}
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-montserrat-regular-400 text-black-light leading-relaxed mb-6 sm:mb-8 italic px-2">
                        "{review.comment}"
                      </p>

                      {/* Media */}
                      {/* Media */}
                      {(() => {
                        const mediaItems = Array.isArray(review.media)
                          ? review.media
                          : review.media
                          ? [review.media]
                          : [];

                        if (mediaItems.length === 0) return null;

                        return (
                          <div className="mb-6">
                            <Slider
                              dots
                              arrows={false}
                              autoplay={true}
                              infinite
                              speed={400}
                              slidesToShow={3}
                              autoplaySpeed={1000}
                              responsive={[
                                {
                                  breakpoint: 1280,
                                  settings: {
                                    slidesToShow: 4,
                                    centerMode: true,
                                    centerPadding: "8%",
                                  },
                                },
                                {
                                  breakpoint: 1024,
                                  settings: {
                                    slidesToShow: 3,
                                    centerMode: true,
                                    centerPadding: "5%",
                                  },
                                },
                                {
                                  breakpoint: 768,
                                  settings: {
                                    slidesToShow: 2,
                                    centerMode: true,
                                    centerPadding: "5%",
                                  },
                                },
                                {
                                  breakpoint: 640,
                                  settings: {
                                    slidesToShow: 1,
                                    centerMode: true,
                                    centerPadding: "15%",
                                  },
                                },
                                {
                                  breakpoint: 480,
                                  settings: {
                                    slidesToShow: 1,
                                    centerMode: true,
                                    centerPadding: "10%",
                                  },
                                },
                              ]}
                              slidesToScroll={1}
                              className="px-6 sm:px-10"
                            >
                              {mediaItems.map((mediaItem, mediaIndex) => (
                                <div
                                  key={
                                    mediaItem.publicId ||
                                    mediaItem.url ||
                                    mediaIndex
                                  }
                                  className="px-2"
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setMediaViewer({
                                        open: true,
                                        item: mediaItem
                                      })
                                    }
                                    className="group w-full focus:outline-none"
                                  >
                                    <div className="relative w-full h-32 sm:h-40 rounded-xl overflow-hidden shadow-md border border-black/10 bg-black">
                                      {mediaItem.type === "video" ? (
                                        <video
                                          src={mediaItem.url}
                                          muted
                                          loop
                                          playsInline
                                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-200"
                                        />
                                      ) : (
                                        <img
                                          src={mediaItem.url}
                                          alt="Review media"
                                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-200"
                                        />
                                      )}
                                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-xs sm:text-sm font-montserrat-medium-500 tracking-wide">
                                          Tap to view
                                        </span>
                                      </div>
                                    </div>
                                  </button>
                                </div>
                              ))}
                            </Slider>
                          </div>
                        );
                      })()}

                      {/* Author Info */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="text-center sm:text-left">
                            <h4 className="font-montserrat-semibold-600 text-black text-base sm:text-lg">
                              {review.name}
                            </h4>
                            <p className="text-xs sm:text-sm font-montserrat-regular-400 text-black-light flex items-center justify-center sm:justify-start space-x-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{formatDate(review.createdAt)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>

              {/* Custom Dots Pagination */}
              {displayReviews.length > 1 && (
                <div
                  className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10"
                  role="tablist"
                >
                  {displayReviews.map((_, index) => (
                    <CustomDot key={index} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Review Button */}
        <div className="mt-8 sm:mt-12 text-center">
          <IconButton onClick={() => setShowReviewForm(true)}rightIcon={Plus}>Write a Review</IconButton>
          
        </div>

        {/* Review Form Modal */}
        {showReviewForm &&
          typeof document !== "undefined" &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-2 sm:p-4 animate-fadeIn">
              <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 md:p-8 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-slideUp">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-sorts-mill-gloudy font-bold text-black">
                    Write a Review
                  </h3>
                  <button
                    onClick={handleCloseForm}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close review form"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-black-light" />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-montserrat-medium-500 text-black mb-3">
                      Rating *
                    </label>
                    <div className="flex space-x-1 sm:space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform duration-200 hover:scale-125"
                          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        >
                          <Star
                            className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${
                              star <= (hoverRating || rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <FormInput
                      label="Your Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      error={errors.name}
                      icon={User}
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <FormInput
                      label="Your Email *"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                      icon={Mail}
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <FormInput
                      label="Your Review *"
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      error={errors.comment}
                      icon={MessageSquare}
                      textarea={true}
                      rows={4}
                      placeholder="Share your experience with us..."
                    />
                  </div>

                  {/* Media */}
                  <div>
                    <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                      Photo or Video (optional)
                    </label>
                    <div
                      className={`border border-dashed rounded-lg p-4 flex flex-col space-y-3 transition-colors ${
                        isDraggingMedia
                          ? "border-primary bg-primary/5"
                          : "border-gray-300 bg-gray-50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <label className="flex flex-col items-center justify-center cursor-pointer">
                        <span className="text-sm font-montserrat-medium-500 text-primary mb-2">
                          Click to upload an image or video
                        </span>
                        <span className="text-xs font-montserrat-regular-400 text-black-light text-center">
                          {`Supported: JPG, PNG, WEBP, MP4, MOV • up to ${MAX_MEDIA_ITEMS} files • 50MB each`}
                        </span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleMediaChange}
                          className="hidden"
                          multiple
                        />
                      </label>

                      {mediaPreviews.length > 0 && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {mediaPreviews.map((preview, index) => (
                            <div
                              key={preview.url}
                              className="relative rounded-md overflow-hidden shadow-sm group"
                            >
                              {preview.type === "video" ? (
                                <video
                                  src={preview.url}
                                  controls
                                  className="w-full max-h-56 bg-black"
                                />
                              ) : (
                                <img
                                  src={preview.url}
                                  alt={`Selected review media ${index + 1}`}
                                  className="w-full h-48 object-cover"
                                />
                              )}
                              {/* <button
                                type="button"
                                onClick={() => handleRemoveMedia(index)}
                                className="absolute top-2 right-2 text-xs font-montserrat-medium-500 text-white bg-black/60 hover:bg-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Remove
                              </button> */}
                              <div className="flex items-center justify-between">
                                <div className="mt-2 px-1">
                                  <p className="text-xs font-montserrat-regular-400 text-black-light  break-words">
                                    {preview.name}
                                  </p>
                                  <p className="text-[10px] font-montserrat-regular-400 text-black-light/70 capitalize">
                                    {preview.type}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMedia(index)}
                                  className="  text-xs font-montserrat-medium-500 text-red-500   px-2 py-1 rounded-md"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.media && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.media}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 sm:py-4 rounded-lg font-montserrat-semibold-600 hover:from-primary-dark hover:to-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>,
            document.body
          )}
      </div>

      {/* Media Viewer */}
      {mediaViewer.open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="relative w-full max-w-4xl">
              <button
                onClick={() => setMediaViewer({ open: false, item: null })}
                className="absolute -top-10 right-0 text-white hover:text-primary transition-colors"
                aria-label="Close media viewer"
              >
                <X className="w-8 h-8" />
              </button>
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-black">
                  {mediaViewer.item?.type === "video" ? (
                    <video
                      src={mediaViewer.item?.url}
                      controls
                      autoPlay
                      className="w-full max-h-[70vh] object-contain bg-black"
                    />
                  ) : (
                    <img
                      src={mediaViewer.item?.url}
                      alt="Review media enlarged"
                      className="w-full max-h-[70vh] object-contain bg-black"
                    />
                  )}
                </div>
                {mediaViewer.item?.name && (
                  <div className="p-4 border-t border-gray-100">
                    <p className="text-sm font-montserrat-medium-500 text-black">
                      {mediaViewer.item.name}
                    </p>
                    <p className="text-xs font-montserrat-regular-400 text-black-light capitalize">
                      {mediaViewer.item.type}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Add animations and custom slider styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(50px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        /* Custom Slick Slider Styles */
        .slick-slide > div {
          min-height: 100%;
        }
        .slick-track {
          display: flex;
          align-items: stretch;
        }
        .slick-slide {
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default ReviewsSlider;
