import React, { useState } from 'react';
import { HelpCircle, X, MessageCircle, Package, Send, User, Mail, Phone, Plus, Minus, Truck } from 'lucide-react';
import { createPortal } from 'react-dom';
import api from '../services/api';
import { API_METHOD } from '../services/apiMethod';

const HelpSupportButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState('help');
  const [openFAQIndex, setOpenFAQIndex] = useState(0);

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Track Order State
  const [orderId, setOrderId] = useState('');
  const [orderEmail, setOrderEmail] = useState('');
  const [orderMobile, setOrderMobile] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [trackingError, setTrackingError] = useState('');

  const faqs = [
    {
      question: 'Where do you ship to?',
      answer: 'We ship worldwide. To get info about shipping methods and delivery price and time, please contact our support.'
    },
    {
      question: 'How can I make the order?',
      answer: 'Simply browse our collection, select your desired items, choose your size and quantity, and add them to your cart. When ready, proceed to checkout, fill in your shipping information, and complete the payment process.'
    },
    {
      question: 'Can I change my order after it is placed?',
      answer: 'You can modify your order within 24 hours of placement by contacting our customer service team. After that, changes may not be possible as production begins.'
    },
    {
      question: 'Do you have offline stores?',
      answer: 'We currently operate as an online-only jewelry store, but we offer virtual consultations and can arrange private viewings for special pieces.'
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order within 24 hours of placement. For custom-made pieces, cancellation may not be possible once production has begun.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (value.trim().length > 100) {
          error = 'Name must be less than 100 characters';
        } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
          error = 'Name can only contain letters, spaces, hyphens, and apostrophes';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email address is required';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim())) {
            error = 'Please enter a valid email address';
          } else if (value.trim().length > 255) {
            error = 'Email must be less than 255 characters';
          } else {
            // Additional validation for email format
            const parts = value.trim().split('@');
            if (parts.length !== 2) {
              error = 'Please enter a valid email address';
            } else if (parts[0].length === 0 || parts[0].length > 64) {
              error = 'Email username is invalid';
            } else if (parts[1].length === 0 || parts[1].length > 255) {
              error = 'Email domain is invalid';
            } else if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(parts[1])) {
              error = 'Please enter a valid email domain';
            }
          }
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else {
          const cleanedPhone = value.replace(/[\s\-().]/g, '');
          if (cleanedPhone.length < 7) {
            error = 'Phone number must be at least 7 digits';
          } else if (cleanedPhone.length > 15) {
            error = 'Phone number must be less than 15 digits';
          } else if (!/^[+]?[1-9][\d]{6,14}$/.test(cleanedPhone)) {
            error = 'Please enter a valid phone number';
          }
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
        [name]: '',
      });
    }

    // Real-time validation for better UX (optional - can be removed if too aggressive)
    // Only validate if field has been touched (has a value or was previously validated)
    if (value.trim() || errors[name]) {
      const error = validateField(name, value);
      if (error) {
        setErrors({
          ...errors,
          [name]: error,
        });
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors({
        ...errors,
        [name]: error,
      });
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    const newErrors = {};
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'message'];
    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    try {
      const contactData = {
        service: 'general',
      };
      
      // Include required fields
      contactData.name = formData.name.trim();
      contactData.email = formData.email.trim();
      contactData.phone = formData.phone.trim();
      contactData.message = formData.message.trim();

      await api.post(API_METHOD.contacts, contactData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to send message. Please try again.' });
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setTrackingError('Please enter an order ID');
      return;
    }
    if (!orderEmail.trim()) {
      setTrackingError('Please enter your email');
      return;
    }

    setTrackingError('');
    setOrderData(null);

    try {
      // Try to fetch order by ID
      const response = await api.get(`${API_METHOD.orders}/${orderId.trim()}`);
      setOrderData(response.data?.data || response.data);
    } catch (error) {
      console.error('Error tracking order:', error);
      setTrackingError(error.response?.data?.message || 'Order not found. Please check your order ID and email.');
    }
  };

  const tabs = [
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'contact', label: 'Contact Us', icon: Mail },
    { id: 'track', label: 'Track Order', icon: Truck },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => {
          if (isOpen) {
            setIsClosing(true);
            setTimeout(() => {
              setIsOpen(false);
              setIsClosing(false);
            }, 300); // Match animation duration
          } else {
            setIsOpen(true);
          }
        }}
        className="fixed bottom-6 right-6 z-50 bg-primary outline-none text-white sm:p-4 p-2 rounded-full shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all duration-300 group"
        aria-label="Help & Support"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <HelpCircle className="w-6 h-6 text-white" />}
      </button>

      {/* Popup Modal */}
      {(isOpen || isClosing) && createPortal(
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
          onClick={() => {
            setIsClosing(true);
            setTimeout(() => {
              setIsOpen(false);
              setIsClosing(false);
            }, 300);
          }}
        >
          <div 
            className={`fixed sm:bottom-24 bottom-[68px] left-4 right-4 sm:left-auto sm:right-6 max-h-[70vh]  bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ${
              isClosing ? 'animate-[slideDown_0.3s_ease-out]' : 'animate-[slideUp_0.3s_ease-out]'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxWidth: '350px',
              width: '100%'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-sorts-mill-gloudy text-black">
                    Help & Support
                  </h2>
                  <p className="text-sm font-montserrat-regular-400 text-black-light">
                    How can we help you?
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsClosing(true);
                  setTimeout(() => {
                    setIsOpen(false);
                    setIsClosing(false);
                  }, 300);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-black-light" />
              </button>
            </div>

           

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {/* Help Tab */}
              {activeTab === 'help' && (
                <div className="sm:p-6 p-4">
                  <div className="mb-6">
                    <h3 className="text-2xl font-sorts-mill-gloudy text-black mb-2">
                      Frequently Asked Questions
                    </h3>
                    <p className="text-black-light font-montserrat-regular-400">
                      Find answers to common questions
                    </p>
                  </div>

                  <div className="space-y-0">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border-b border-gray-200 last:border-b-0">
                        <button
                          onClick={() => toggleFAQ(index)}
                          className="w-full py-4 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-200"
                        >
                          <span className="text-base font-montserrat-semibold-600 text-black pr-4 flex-1">
                            {faq.question}
                          </span>
                          <div className="relative w-5 h-5 flex-shrink-0">
                            <Plus 
                              className={`absolute inset-0 w-5 h-5 text-black transition-all duration-300 ease-in-out ${
                                openFAQIndex === index 
                                  ? 'opacity-0 rotate-90 scale-0' 
                                  : 'opacity-100 rotate-0 scale-100'
                              }`}
                            />
                            <Minus 
                              className={`absolute inset-0 w-5 h-5 text-black transition-all duration-300 ease-in-out ${
                                openFAQIndex === index 
                                  ? 'opacity-100 rotate-0 scale-100' 
                                  : 'opacity-0 -rotate-90 scale-0'
                              }`}
                            />
                          </div>
                        </button>
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openFAQIndex === index 
                              ? 'max-h-96 opacity-100' 
                              : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="pb-4">
                            <p className="text-black/80 font-montserrat-regular-400 leading-relaxed text-sm">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Us Tab */}
              {activeTab === 'contact' && (
                <div className="sm:p-6 p-4">
                  <div className="mb-6">
                    <h3 className="text-2xl font-sorts-mill-gloudy text-black mb-2">
                      Contact Us
                    </h3>
                    <p className="text-black-light font-montserrat-regular-400">
                      Fill out the form below and we'll get back to you within 24 hours
                    </p>
                  </div>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    {submitStatus === 'success' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 font-montserrat-medium-500 text-sm">
                          Thank you! Your message has been sent successfully. We'll get back to you soon.
                        </p>
                      </div>
                    )}

                    {submitStatus === 'error' && errors.submit && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 font-montserrat-medium-500 text-sm">
                          {errors.submit || 'Please fix the errors below and try again.'}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.name ? 'text-red-500' : 'text-black-light'}`} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 transition-colors duration-200 ${
                            errors.name
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-primary'
                          }`}
                          placeholder="Your full name"
                          maxLength={100}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 font-montserrat-regular-400">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.email ? 'text-red-500' : 'text-black-light'}`} />
                        <input
                          type="text"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 transition-colors duration-200 ${
                            errors.email
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-primary'
                          }`}
                          placeholder="your.email@example.com"
                          maxLength={255}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 font-montserrat-regular-400">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.phone ? 'text-red-500' : 'text-black-light'}`} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 transition-colors duration-200 ${
                            errors.phone
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-primary'
                          }`}
                          placeholder="Your phone number"
                          maxLength={20}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 font-montserrat-regular-400">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 resize-none transition-colors duration-200 ${
                          errors.message
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary'
                        }`}
                        placeholder="Tell us more about your inquiry..."
                        maxLength={1000}
                      ></textarea>
                      <div className="mt-1 text-right">
                        <span className={`text-xs font-montserrat-regular-400 ${
                          formData.message.length > 1000 
                            ? 'text-red-500' 
                            : formData.message.length > 900 
                            ? 'text-yellow-600' 
                            : 'text-gray-400'
                        }`}>
                          {formData.message.length}/1000
                        </span>
                      </div>
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600 font-montserrat-regular-400">{errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full font-montserrat-medium-500 py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 ${
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
              )}

              {/* Track Order Tab */}
              {activeTab === 'track' && (
                <div className="flex flex-col h-full">
                  {/* Header with Green Gradient */}
                  <div className="relative bg-gradient-to-r from-primary to-primary-light    text-white p-6 pb-8">
                    {/* <button
                      onClick={() => {
                        setIsClosing(true);
                        setTimeout(() => {
                          setIsOpen(false);
                          setIsClosing(false);
                        }, 300);
                      }}
                      className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button> */}
                    <h3 className="sm:text-3xl text-2xl  font-sorts-mill-gloudy font-bold mb-2">
                      Track Order
                    </h3>
                    <p className="text-white/90 font-montserrat-regular-400">
                      Track your placed order location
                    </p>
                    {/* Wavy bottom edge */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 overflow-hidden">
                      <svg viewBox="0 0 400 40" className="w-full h-full" preserveAspectRatio="none">
                        <path
                          d="M0,40 Q100,20 200,30 T400,30 L400,40 L0,40 Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Form Content */}
                  <div className="flex-1 overflow-y-auto bg-white sm:p-6 p-4">
                    <div className="space-y-6">
                      {/* Order Number */}
                      <div>
                        <label className="block text-sm font-montserrat-semibold-600 text-black mb-3">
                          Order Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={orderId}
                          onChange={(e) => {
                            setOrderId(e.target.value);
                            setTrackingError('');
                            setOrderData(null);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1  focus:ring-primary  outline-none font-montserrat-regular-400 text-base"
                          placeholder="Enter your order number"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-montserrat-semibold-600 text-black mb-3">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={orderEmail}
                          onChange={(e) => {
                            setOrderEmail(e.target.value);
                            setTrackingError('');
                            setOrderData(null);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1  focus:ring-primary  outline-none font-montserrat-regular-400 text-base"
                          placeholder="Enter your email"
                        />
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label className="block text-sm font-montserrat-semibold-600 text-black mb-3">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          value={orderMobile}
                          onChange={(e) => {
                            setOrderMobile(e.target.value);
                            setTrackingError('');
                            setOrderData(null);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1  focus:ring-primary  outline-none font-montserrat-regular-400 text-base"
                          placeholder="Enter your mobile number"
                        />
                      </div>

                      {trackingError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-sm text-red-600 font-montserrat-regular-400">{trackingError}</p>
                        </div>
                      )}

                      {orderData && (
                        <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-montserrat-semibold-600 text-black mb-4">Order Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-black-light">Order ID:</span>
                              <span className="font-montserrat-medium-500 text-black">{orderData.orderNumber || orderData.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-black-light">Status:</span>
                              <span className="font-montserrat-medium-500 text-black capitalize">{orderData.status || 'Processing'}</span>
                            </div>
                            {orderData.total && (
                              <div className="flex justify-between">
                                <span className="text-black-light">Total:</span>
                                <span className="font-montserrat-medium-500 text-black">${orderData.total}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Track Button */}
                      <button
                        onClick={handleTrackOrder}
                        className="w-full py-2 px-6 rounded-lg border-2 border-primary bg-white text-primary font-montserrat-bold-700 text-md  transition-colors duration-300 uppercase tracking-wide"
                      >
                        Track
                      </button>
                    </div>
                  </div>

                  {/* Footer with Compact Navigation */}
                  {/* <div className="bg-white p-6 pt-8">
                    <div className="flex justify-center items-center mb-4">
                      <div className="relative bg-gradient-to-r from-green-500 to-green-400 rounded-full px-2 py-2 flex items-center space-x-1">
                        {tabs.map((tab) => {
                          const Icon = tab.id === 'help' ? HelpCircle : tab.id === 'contact' ? Mail : Truck;
                          const isActive = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`relative p-3 rounded-full transition-all duration-200 ${
                                isActive
                                  ? 'bg-white/20'
                                  : 'hover:bg-white/10'
                              }`}
                              aria-label={tab.label}
                            >
                              <Icon className="w-5 h-5 text-white" />
                              {isActive && (
                                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"></div>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <p className="text-center text-xs text-gray-500 font-montserrat-regular-400">
                      Powered by <span className="underline">Chatix</span>
                    </p>
                  </div> */}
                </div>
              )}
            </div>
             {/* Tabs - Compact Navigation Bar */}
             <div className="flex w-full justify-center items-center p-4 bg-white sticky top-[88px] z-10">
              <div className="relative bg-gradient-to-r from-primary to-primary-light rounded-full px-2 py-2 flex items-center space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative p-3 rounded-full transition-all duration-200 ${
                        isActive
                          ? 'bg-white/20'
                          : 'hover:bg-white/10'
                      }`}
                      aria-label={tab.label}
                    >
                      <Icon className="w-5 h-5 text-white" />
                      {isActive && (
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default HelpSupportButton;
