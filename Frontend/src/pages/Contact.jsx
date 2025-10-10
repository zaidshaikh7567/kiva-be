import React, { useState } from "react";
import contactBg from "../assets/images/contact-bg.jpg";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Calendar, User, Globe } from "lucide-react";
import CustomDropdown from "../components/CustomDropdown";

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleServiceChange = (value) => {
    setFormData({
      ...formData,
      service: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      service: 'general'
    });
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
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

      {/* Contact Information Cards */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Phone */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-montserrat-semibold-600 text-black mb-4">Call Us</h3>
              <p className="text-primary font-montserrat-bold-700 text-lg mb-2">+1 (555) 123-4567</p>
              <p className="text-black-light font-montserrat-regular-400 text-sm">
                Mon-Fri: 9AM-7PM<br />
                Sat: 10AM-6PM<br />
                Sun: 12PM-5PM
              </p>
            </div>

            {/* Email */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-montserrat-semibold-600 text-black mb-4">Email Us</h3>
              <p className="text-primary font-montserrat-bold-700 text-lg mb-2">info@aurorajewelry.com</p>
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
                New York, NY 10001<br />
                United States<br />
                By appointment
              </p>
            </div>

            {/* Hours */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-montserrat-semibold-600 text-black mb-4">Store Hours</h3>
              <p className="text-primary font-montserrat-bold-700 text-lg mb-2">Mon-Sat: 10AM-6PM</p>
              <p className="text-black-light font-montserrat-regular-400 text-sm">
                Sunday: 12PM-5PM<br />
                Holiday hours vary<br />
                Call ahead
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Additional Info */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-montserrat-medium-500 text-black mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-montserrat-regular-400"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-montserrat-medium-500 text-black mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-montserrat-regular-400"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-montserrat-medium-500 text-black mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-montserrat-regular-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
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
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-montserrat-regular-400"
                    placeholder="Brief subject of your inquiry"
                  />
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
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-montserrat-regular-400 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white font-montserrat-medium-500 py-4 px-8 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-2 text-lg"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
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
                  <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors duration-300">
                    <span className="text-white font-bold text-sm">f</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors duration-300">
                    <span className="text-white font-bold text-sm">i</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors duration-300">
                    <span className="text-white font-bold text-sm">t</span>
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
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
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
    </div>
  );
};

export default Contact;
