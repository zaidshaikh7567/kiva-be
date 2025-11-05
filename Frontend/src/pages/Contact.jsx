import React, { useState } from "react";
import contactBg from "../assets/images/contact-bg.jpg";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Calendar, User, Globe } from "lucide-react";
import CustomDropdown from "../components/CustomDropdown";
import { FaFacebook,  } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { RiInstagramFill } from "react-icons/ri";
import AnimatedSection from "../components/home/AnimatedSection";
import api from "../services/api";
import { API_METHOD } from "../services/apiMethod";
const SERVICE_OPTIONS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'custom', label: 'Custom Design' },
  { value: 'repair', label: 'Jewelry Repair' },
  { value: 'appraisal', label: 'Jewelry Appraisal' },
  { value: 'consultation', label: 'Personal Consultation' },
  { value: 'wholesale', label: 'Wholesale Inquiry' },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: 'general'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  // Validation functions
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = 'Name can only contain letters and spaces';
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          error = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'phone':
        if (value.trim() && !/^[+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-()]/g, ''))) {
          error = 'Please enter a valid phone number';
        }
        break;
        
      case 'subject':
        if (!value.trim()) {
          error = 'Subject is required';
        } else if (value.trim().length < 5) {
          error = 'Subject must be at least 5 characters';
        } else if (value.trim().length > 100) {
          error = 'Subject must be less than 100 characters';
        }
        break;
        
      case 'message':
        if (!value.trim()) {
          error = 'Message is required';
        } else if (value.trim().length < 10) {
          error = 'Message must be at least 10 characters';
        } else if (value.trim().length > 1000) {
          error = 'Message must be less than 1000 characters';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['name', 'email', 'subject', 'message'];
    
    // Validate required fields
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    // Validate optional fields
    if (formData.phone) {
      const phoneError = validateField('phone', formData.phone);
      if (phoneError) {
        newErrors.phone = phoneError;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    // Real-time validation for better UX
    const error = validateField(name, value);
    if (error) {
      setErrors({
        ...errors,
        [name]: error
      });
    }
  };

  const handleServiceChange = (value) => {
    setFormData({
      ...formData,
      service: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous status
    setSubmitStatus(null);
    
    // Validate form
    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare data for API (combine subject and message if subject exists)
      const messageText = formData.subject 
        ? `Subject: ${formData.subject}\n\n${formData.message}`
        : formData.message;

      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: messageText.trim(),
        service: formData.service || 'general'
      };

      // Add phone only if provided
      if (formData.phone && formData.phone.trim()) {
        contactData.phone = formData.phone.trim();
      }

      // Submit contact form
      await api.post(API_METHOD.contacts, contactData);
      
      // Success
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        service: 'general'
      });
      setErrors({});
      
    } catch (error) {
      console.error('Error submitting contact form:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message. Please try again.';
      setErrors({ submit: errorMessage });
      setSubmitStatus('error');
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
              alt="Contact Aurora Jewelry"
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
                We're here to help you find the perfect piece or answer any questions
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
  {/* Phone */}
  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
      <Phone className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-xl font-montserrat-semibold-600 text-black mb-4">Call Us</h3>
    <a
      href="tel:+919106302269"
      className="text-primary font-montserrat-bold-700 text-lg mb-2 block hover:underline"
    >
      +91 9106302269
    </a>
    <p className="text-black-light font-montserrat-regular-400 text-sm">
      Mon-Fri: 9AM-7PM<br />
      Sat: 9AM-3PM<br />
      Sun: Closed
    </p>
  </div>

  {/* Email */}
  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
      <Mail className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-xl font-montserrat-semibold-600 text-black mb-4">Email Us</h3>
    <a
      href="mailto:kivadiamond3008@gmail.com"
      className="text-primary font-montserrat-bold-700 text-lg mb-2 block hover:underline"
    >
      kivadiamond3008@gmail.com
    </a>
    <p className="text-black-light font-montserrat-regular-400 text-sm">
      General inquiries<br />
      Custom designs<br />
      Support requests
    </p>
  </div>

  {/* Visit */}
  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
      <MapPin className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-xl font-montserrat-semibold-600 text-black mb-4">Visit Us</h3>
    <p className="text-primary font-montserrat-bold-700 text-lg mb-2">123 Jewelry Lane</p>
    <p className="text-black-light font-montserrat-regular-400 text-sm">
      3rd floor above Krishna Hospital,<br />
      Near Piplas Char Rasta, Katargam Main Road,<br />
      Surat, 395004 (India)<br />
      By appointment
    </p>
  </div>
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
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-5 h-5 min-w-5 min-h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-green-800 font-montserrat-medium-500">
                        Thank you! Your message has been sent successfully. We'll get back to you soon.
                      </p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-red-800 font-montserrat-medium-500">
                        {errors.submit || 'Please fix the errors below and try again.'}
                      </p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-montserrat-medium-500 text-black mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.name ? 'text-red-500' : 'text-black-light'}`} />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}                
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 transition-colors duration-200 ${
                          errors.name 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-primary focus:border-transparent'
                        }`}
                        placeholder="Your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 font-montserrat-regular-400">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-montserrat-medium-500 text-black mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.phone ? 'text-red-500' : 'text-black-light'}`} />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 transition-colors duration-200 ${
                          errors.phone 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-primary focus:border-transparent'
                        }`}
                        placeholder="Your phone number"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 font-montserrat-regular-400">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-montserrat-medium-500 text-black mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.email ? 'text-red-500' : 'text-black-light'}`} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}              
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 transition-colors duration-200 ${
                        errors.email 
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-primary focus:border-transparent'
                      }`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 font-montserrat-regular-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-montserrat-medium-500 text-black mb-2">
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
                  <label htmlFor="subject" className="block text-sm font-montserrat-medium-500 text-black mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}            
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 transition-colors duration-200 ${
                      errors.subject 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-primary focus:border-transparent'
                    }`}
                    placeholder="Brief subject of your inquiry"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 font-montserrat-regular-400">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-montserrat-medium-500 text-black mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}            
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 resize-none transition-colors duration-200 ${
                      errors.message 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-primary focus:border-transparent'
                    }`}
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 font-montserrat-regular-400">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-montserrat-medium-500 py-4 px-8 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 text-lg ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark'
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
              <div className="bg-gradient-to-br from-primary-light to-primary rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-montserrat-bold-700 text-black">Quick Response</h3>
                </div>
                <p className="text-black-light font-montserrat-regular-400 mb-4">
                  We typically respond to all inquiries within 24 hours. For urgent matters, 
                  please call us directly during business hours.
                </p>
                <div className="flex items-center space-x-2 text-primary font-montserrat-medium-500">
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
                  <h3 className="text-2xl font-montserrat-bold-700">Book a Consultation</h3>
                </div>
                <p className="text-gray-300 font-montserrat-regular-400 mb-6">
                  Schedule a personal consultation with our jewelry experts to discuss 
                  custom designs, appraisals, or find the perfect piece.
                </p>
                <button className="w-full bg-primary text-white font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300">
                  Schedule Consultation
                </button>
              </div>

              {/* Social Media */}
              <div className="bg-secondary rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-montserrat-bold-700 text-black">Follow Us</h3>
                </div>
                <p className="text-black-light font-montserrat-regular-400 mb-6">
                  Stay connected with us on social media for the latest collections, 
                  jewelry tips, and behind-the-scenes content.
                </p>
                <div className="flex space-x-4">
                  <a href="https://www.facebook.com/kiva.diamond/?rdid=GnfsBsErFgHnpej1" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors duration-300">
                    <span className="text-white font-bold text-xl"><FaFacebook/></span>
                  </a>
                  <a href="https://www.instagram.com/kiva.diamond/?igsh=amV5ZDN3M3Y4a3lo#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors duration-300">
                    <span className="text-white font-bold text-xl"><RiInstagramFill/></span>
                  </a>
                  <a href="https://api.whatsapp.com/send/?phone=919106302269&text&type=phone_number&app_absent=0" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors duration-300">
                    <span className="text-white font-bold text-xl"><IoLogoWhatsapp/></span>
                  </a>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-2 border-primary rounded-2xl p-6">
                <h4 className="text-lg font-montserrat-semibold-600 text-black mb-3">Emergency Jewelry Repair</h4>
                <p className="text-black-light font-montserrat-regular-400 text-sm mb-3">
                  Need urgent jewelry repair or have a damaged piece? We offer emergency repair services.
                </p>
                <div className="flex items-center space-x-2 text-primary font-montserrat-medium-500">
                  <Phone className="w-4 h-4" />
                  {/* <span className="text-sm">+91 9106302269</span> */}
                  <a href="tel:+919106302269" className="text-sm">+91 9106302269</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Map Section */}
      <AnimatedSection animationType="fadeInRight" delay={400}>
        <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-sorts-mill-gloudy text-black mb-6">
              Visit Our Showroom
            </h2>
            <p className="text-lg font-montserrat-regular-400 text-black-light max-w-2xl mx-auto">
              Located in the heart of New York City, our showroom offers an intimate setting to explore our collections
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Map Placeholder */}
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

              {/* Location Details */}
              <div className="p-8">
                <h3 className="text-2xl font-montserrat-bold-700 text-black mb-6">Showroom Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-montserrat-semibold-600 text-black mb-2">Address</h4>
                    <p className="text-black-light font-montserrat-regular-400">
                      123 Jewelry Lane<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>

                  <div>
                    <h4 className="font-montserrat-semibold-600 text-black mb-2">Parking</h4>
                    <p className="text-black-light font-montserrat-regular-400">
                      Valet parking available<br />
                      Street parking nearby<br />
                      Garage parking 1 block away
                    </p>
                  </div>

                  <div>
                    <h4 className="font-montserrat-semibold-600 text-black mb-2">Public Transportation</h4>
                    <p className="text-black-light font-montserrat-regular-400">
                      Subway: 1, 2, 3 lines (5 min walk)<br />
                      Bus: M1, M2, M3 (2 min walk)<br />
                      Taxi/Uber: Drop-off available
                    </p>
                  </div>

                  <div>
                    <h4 className="font-montserrat-semibold-600 text-black mb-2">Accessibility</h4>
                    <p className="text-black-light font-montserrat-regular-400">
                      Wheelchair accessible entrance<br />
                      Elevator available<br />
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
      </AnimatedSection>
    </div>
  );
};

export default Contact;
