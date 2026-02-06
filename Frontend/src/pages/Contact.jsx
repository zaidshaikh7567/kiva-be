import React, { useState } from "react";
import contactBg from "../assets/images/contact-bg.jpg";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Calendar,
  User,
  Globe,
  PenTool,
} from "lucide-react";
import CustomDropdown from "../components/CustomDropdown";
import { FaFacebook } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { RiInstagramFill } from "react-icons/ri";
import AnimatedSection from "../components/home/AnimatedSection";
import api from "../services/api";
import { API_METHOD } from "../services/apiMethod";
  import { SERVICE_OPTIONS } from "../constants";
import FormInput from "../components/FormInput";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    service: "general",
  });
  const FACEBOOK_URL = import.meta.env.VITE_FACEBOOK_URL;
  const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL;
  const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL;
  const EMAIL_URL = import.meta.env.VITE_EMAIL_URL;
  const PHONE_NUMBER_COMBO = import.meta.env.VITE_NUMBER_COMBO;
  const PHONE_NUMBER_SEPARATE = import.meta.env.VITE_NUMBER_SEPARATE;
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const contactItems = [
    {
      icon: <Phone className="w-8 h-8 text-white" />,
      title: "Call Us",
      mainText: PHONE_NUMBER_SEPARATE,
      link: `tel:${PHONE_NUMBER_COMBO}`,
      isLink: true,
      subText: (
        <>
          Mon-Fri: 9AM-7PM <br />
          Sat: 9AM-3PM <br />
          Sun: Closed
        </>
      ),
    },
    {
      icon: <Mail className="w-8 h-8 text-white" />,
      title: "Email Us",
      mainText: EMAIL_URL,
      link: `mailto:${EMAIL_URL}`,
      isLink: true,
      subText: (
        <>
          General inquiries <br />
          Custom designs <br />
          Support requests
        </>
      ),
    },
    {
      icon: <MapPin className="w-8 h-8 text-white" />,
      title: "Visit Us",
      mainText: "Kiva Jewelry",
      link: null,
      isLink: false,
      subText: (
        <>
          3rd floor above Krishna Hospital, <br />
          Near Piplas Char Rasta, Katargam Main Road, <br />
          Surat, 395004 (India) <br />
          By appointment
        </>
      ),
    },
  ];
  // Validation functions
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Full name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = "Name can only contain letters and spaces";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Please enter a valid email address";
        }
        break;
// enter only number
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (value.trim().length < 7) {
          error = "Phone number must be at least 7 digits";
        } else if (value.trim().length > 15) {
          error = "Phone number must be less than 15 digits"; 
        } else if (!/^[0-9]+$/.test(value.trim())) {
          error = "Please enter a valid phone number";
        }
        break;

      case "message":
        if (!value.trim()) {
          error = "Message is required";
        } else if (value.trim().length < 10) {
          error = "Message must be at least 10 characters";
        } else if (value.trim().length > 1000) {
          error = "Message must be less than 1000 characters";
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

    // Validate required fields
    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Real-time validation for better UX
    const error = validateField(name, value);
    if (error) {
      setErrors({
        ...errors,
        [name]: error,
      });
    }
  };

  const handleServiceChange = (value) => {
    setFormData({
      ...formData,
      service: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous status
    setSubmitStatus(null);

    // Validate form
    if (!validateForm()) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        service: formData.service || "general",
      };

      // Submit contact form
      await api.post(API_METHOD.contacts, contactData);

      // Success
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        service: "general",
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting contact form:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send message. Please try again.";
      setErrors({ submit: errorMessage });
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <AnimatedSection animationType="fadeInUp" delay={100}>
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={contactBg}
              alt="Contact Kiva Jewellery"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <h1 className="text-5xl md:text-7xl font-sorts-mill-gloudy leading-tight mb-6">
                Contact Us<span className="text-primary">.</span>
              </h1>
              <p className="text-xl md:text-2xl font-montserrat-regular-400 mb-8 max-w-2xl mx-auto">
                We're here to help you find the perfect piece or answer any
                questions
              </p>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Contact Information Cards */}
      <AnimatedSection animationType="scaleIn" delay={200}>
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-sorts-mill-gloudy text-black mb-6">
                Get in Touch
              </h2>
              <p className="text-lg font-montserrat-regular-400 text-black-light max-w-2xl mx-auto">
                Multiple ways to reach us - choose what works best for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {contactItems.map((item, i) => (
        <div
          key={i}
          className="bg-white sm:p-8 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
        >
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            {item.icon}
          </div>

          <h3 className="text-xl font-montserrat-semibold-600 text-black mb-4">
            {item.title}
          </h3>

          {item.isLink ? (
            <a
              href={item.link}
              className="text-primary font-montserrat-bold-700 sm:text-lg text-sm  mb-2 block hover:underline"
            >
              {item.mainText}
            </a>
          ) : (
            <p className="text-primary font-montserrat-bold-700 sm:text-lg text-sm mb-2">
              {item.mainText}
            </p>
          )}

          <p className="text-black-light font-montserrat-regular-400 text-sm">
            {item.subText}
          </p>
        </div>
      ))}
    </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Contact Form & Additional Info */}
      <AnimatedSection animationType="fadeInLeft" delay={300}>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <div className="mb-8">
                  <h2 className="text-4xl font-sorts-mill-gloudy text-black mb-4">
                    Send Us a Message<span className="text-primary">.</span>
                  </h2>
                  <p className="text-lg font-montserrat-regular-400 text-black-light">
                    Fill out the form below and we'll get back to you within 24
                    hours
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Status Messages */}
                  {submitStatus === "success" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <div className="w-5 h-5 min-w-5 min-h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-green-800 font-montserrat-medium-500">
                          Thank you! Your message has been sent successfully.
                          We'll get back to you soon.
                        </p>
                      </div>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-red-800 font-montserrat-medium-500">
                          {errors.submit ||
                            "Please fix the errors below and try again."}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>

                      <FormInput
                        label="Full Name *"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={errors.name}
                        icon={User}
                        placeholder="Your full name"
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
                        placeholder="Your phone number"
                        inputMode="numeric"
                      />
                      
                    </div>
                  </div>

                  <div>
                    <FormInput
                      label="Email Address *"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                      icon={Mail}
                      placeholder="Your email address"
                    />  
                    
                  </div>

                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-montserrat-medium-500 text-black mb-2"
                    >
                      Service Interest
                    </label>
                    <CustomDropdown
                      options={SERVICE_OPTIONS}
                      value={formData.service}
                      onChange={handleServiceChange}
                      placeholder="Select a service"
                      searchable={false}
                    />
                  </div>

                  <div>
                    <FormInput
                      label="Message *"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      error={errors.message}
                      // icon={PenTool}
                      placeholder="Tell us more about your inquiry..."
                      textarea={true}
                      rows={6}

                    />  
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full font-montserrat-medium-500 py-4 px-8 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 text-lg ${
                      isSubmitting
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Additional Information */}
              <div className="space-y-8">
                {/* Quick Response */}
                <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-montserrat-bold-700 text-black">
                      Quick Response
                    </h3>
                  </div>
                  <p className="text-black-light font-montserrat-regular-400 mb-4">
                    We typically respond to all inquiries within 24 hours. For
                    urgent matters, please call us directly during business
                    hours.
                  </p>
                  <div className="flex items-center space-x-2 text-primary-dark font-montserrat-medium-500">
                    <Clock className="w-4 h-4" />
                    <span>Response time: 24 hours</span>
                  </div>
                </div>

                {/* Consultation Booking */}
                <div className="bg-gradient-to-br from-black to-black-light rounded-2xl p-8 text-white">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-montserrat-bold-700">
                      Book a Consultation
                    </h3>
                  </div>
                  <p className="text-gray-300 font-montserrat-regular-400 mb-6">
                    Schedule a personal consultation with our jewelry experts to
                    discuss custom designs, appraisals, or find the perfect
                    piece.
                  </p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="w-full bg-primary text-white font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300">
                    Schedule Consultation
                  </a>
                </div>

                {/* Social Media */}
                <div className="bg-secondary rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-montserrat-bold-700 text-black">
                      Follow Us
                    </h3>
                  </div>
                  <p className="text-black-light font-montserrat-regular-400 mb-6">
                    Stay connected with us on social media for the latest
                    collections, jewelry tips, and behind-the-scenes content.
                  </p>
                  <div className="flex space-x-4">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={FACEBOOK_URL}
                      className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors duration-300"
                    >
                      <span className="text-white font-bold text-xl">
                        <FaFacebook />
                      </span>
                    </a>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={INSTAGRAM_URL}
                      className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors duration-300"
                    >
                      <span className="text-white font-bold text-xl">
                        <RiInstagramFill />
                      </span>
                    </a>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={WHATSAPP_URL}
                      className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors duration-300"
                    >
                      <span className="text-white font-bold text-xl">
                        <IoLogoWhatsapp />
                      </span>
                    </a>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Map Section */}
      {/* <AnimatedSection animationType="fadeInRight" delay={400}>
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-sorts-mill-gloudy text-black mb-6">
                Visit Our Showroom
              </h2>
              <p className="text-lg font-montserrat-regular-400 text-black-light max-w-2xl mx-auto">
                Located in the heart of New York City, our showroom offers an
                intimate setting to explore our collections
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">

                <div className="h-96 bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-black-light font-montserrat-regular-400">
                      Interactive map would be embedded here
                    </p>
                    <p className="text-primary font-montserrat-medium-500 mt-2">
                      123 Jewelry Lane, New York, NY 10001
                    </p>
                  </div>
                </div>


                <div className="p-8">
                  <h3 className="text-2xl font-montserrat-bold-700 text-black mb-6">
                    Showroom Information
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-montserrat-semibold-600 text-black mb-2">
                        Address
                      </h4>
                      <p className="text-black-light font-montserrat-regular-400">
                        123 Jewelry Lane
                        <br />
                        New York, NY 10001
                        <br />
                        United States
                      </p>
                    </div>

                    <div>
                      <h4 className="font-montserrat-semibold-600 text-black mb-2">
                        Parking
                      </h4>
                      <p className="text-black-light font-montserrat-regular-400">
                        Valet parking available
                        <br />
                        Street parking nearby
                        <br />
                        Garage parking 1 block away
                      </p>
                    </div>

                    <div>
                      <h4 className="font-montserrat-semibold-600 text-black mb-2">
                        Public Transportation
                      </h4>
                      <p className="text-black-light font-montserrat-regular-400">
                        Subway: 1, 2, 3 lines (5 min walk)
                        <br />
                        Bus: M1, M2, M3 (2 min walk)
                        <br />
                        Taxi/Uber: Drop-off available
                      </p>
                    </div>

                    <div>
                      <h4 className="font-montserrat-semibold-600 text-black mb-2">
                        Accessibility
                      </h4>
                      <p className="text-black-light font-montserrat-regular-400">
                        Wheelchair accessible entrance
                        <br />
                        Elevator available
                        <br />
                        ADA compliant facilities
                      </p>
                    </div>
                  </div>

                  <button className="mt-8 w-full bg-primary text-white font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection> */}
    </div>
  );
};

export default Contact;
