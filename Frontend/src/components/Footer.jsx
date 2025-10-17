import React from "react";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Container from "./Container";
import { Link } from "react-router-dom";
import giaLogo from "../assets/icon/gia.svg";
import igiLogo from "../assets/icon/igi.svg";
import Logo from '../assets/images/kiva-diamond-logo.png'

const Footer = () => {
  // Social Media Links
  const socialLinks = [
    { icon: <FaFacebook className="w-5 h-5 text-white" />, href: "#", label: "Facebook" },
    { icon: <FaInstagram className="w-5 h-5 text-white" />, href: "#", label: "Instagram" },
    { icon: <FaXTwitter className="w-5 h-5 text-white" />, href: "#", label: "Twitter" },
  ];

  // Quick Links
  const quickLinks = [
    { href: "/about", text: "About Us" },
    { href: "/rings", text: "Rings" },
    { href: "/earrings", text: "Earrings" },
    { href: "/bracelets", text: "Bracelets" },
    { href: "/necklaces", text: "Necklaces" },
    { href: "/contact", text: "Contact Us" },
  ];

  // Customer Service Links
  const customerLinks = [
    { href: "/shipping-info", text: "Shipping Info" },
    { href: "/size-guide", text: "Size Guide" },
    { href: "/jewelry-care", text: "Jewelry Care" },
    { href: "/faq", text: "FAQ" },
    { href: "/privacy-policy", text: "Privacy Policy" },
  ];

  // Contact Info
  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5 text-white" />,
      title: "Phone",
      value: "+1 (555) 123-4567",
    },
    {
      icon: <Mail className="w-5 h-5 text-white" />,
      title: "Email",
      value: "info@aurorajewelry.com",
    },
    {
      icon: <MapPin className="w-5 h-5 text-white" />,
      title: "Address",
      value: "123 Jewelry Lane, NY 10001",
    },
  ];

  return (
    <footer className="text-white bg-primary-light">
      <div className="px-4 sm:px-6 md:px-8 xl:px-32">
        {/* Main Footer Content */}
        <div className="pt-12 pb-8 sm:pt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Info */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="mb-4">
                {/* Your Logo with dark background for white/gold text visibility */}
                <div className="inline-block bg-gray-600 rounded-lg p-1 shadow-2xl">
                  <img 
                    src={Logo} 
                    alt="KIVA Diamond Logo" 
                    className="h-[55px] w-auto"
                    style={{
                      filter: 'brightness(1.1) contrast(1.1)'
                    }}
                  />
                </div>
              </div>
              
              <p className="text-black-light font-montserrat-regular-400 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
                Crafting exquisite jewelry pieces that tell your unique story.
                From timeless classics to contemporary designs, we create pieces
                that celebrate life's most precious moments.
              </p>

              {/* Social Media */}
              <div className="flex space-x-3 sm:space-x-4 justify-center sm:justify-start">
                {socialLinks.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    aria-label={item.label}
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors duration-300"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 sm:mt-0 mx-auto text-center">
              <h3 className="text-base sm:text-lg font-montserrat-semibold-600 mb-4 sm:mb-6 text-white">
                Quick Links
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-black-light hover:text-primary transition-colors duration-300 font-montserrat-regular-400 text-sm sm:text-[14px]"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div className="mt-8 sm:mt-0 mx-auto text-center">
              <h3 className="text-base sm:text-lg font-montserrat-semibold-600 mb-4 sm:mb-6 text-white">
                Customer Service
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {customerLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-black-light hover:text-primary transition-colors duration-300 font-montserrat-regular-400 text-sm sm:text-[14px]"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-black-light flex justify-center md:justify-between w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 items-center md:w-full">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    {info.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-montserrat-medium-500 text-xs sm:text-[14px] text-black-light">
                      {info.title}
                    </p>
                    <p className="text-black-light font-montserrat-regular-400 text-xs sm:text-[13px] break-words">
                      {info.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-black-light">
            <div className="text-center">
              <h3 className="text-xs sm:text-sm font-montserrat-semibold-600 text-black-light mb-4">
                Certified & Trusted
              </h3>
              <div className="flex items-center justify-center gap-4 sm:gap-8">
                <div className="group">
                  <img 
                    src={giaLogo} 
                    alt="GIA Certified" 
                    className="h-10 sm:h-12 md:h-16 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300 filter hover:grayscale-0"
                  />
                </div>
                <div className="group">
                  <img 
                    src={igiLogo} 
                    alt="IGI Certified" 
                    className="h-10 sm:h-12 md:h-16 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300 filter hover:grayscale-0"
                  />
                </div>
              </div>
              <p className="text-xs text-black-light font-montserrat-regular-400 mt-3 px-4">
                Our diamonds and gemstones are certified by leading gemological institutes
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 sm:py-6 border-t border-black-light">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 text-center sm:text-left">
            <div className="text-black-light font-montserrat-regular-400 text-xs sm:text-[14px]">
              &copy; {new Date().getFullYear()} Aurora Jewelry. All rights reserved.
            </div>
            <div className="flex items-center space-x-1 text-black-light font-montserrat-regular-400 text-xs sm:text-[14px]">
              <span>Made with</span>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-primary fill-current" />
              <span>for jewelry lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;