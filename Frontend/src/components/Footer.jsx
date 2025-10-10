import React from "react";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Container from "./Container";
import { Link } from "react-router-dom";
import giaLogo from "../assets/icon/gia.svg";
import igiLogo from "../assets/icon/igi.svg";

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
    { href: "/returns-exchanges", text: "Returns & Exchanges" },
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
      <div className="px-6 md:px-16 xl:px-32">
        {/* Main Footer Content */}
        <div className="pt-16 pb-8 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="text-xl font-serif text-primary mb-4">Aurora</div>
              <p className="text-black-light font-montserrat-regular-400 text-[16px] leading-relaxed mb-6 max-w-md">
                Crafting exquisite jewelry pieces that tell your unique story.
                From timeless classics to contemporary designs, we create pieces
                that celebrate life's most precious moments.
              </p>

              {/* Social Media */}
              <div className="flex space-x-4">
                {socialLinks.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    aria-label={item.label}
                    className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors duration-300"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-montserrat-semibold-600 mb-6 text-white">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-black-light hover:text-primary transition-colors duration-300 font-montserrat-regular-400 text-[14px]"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-montserrat-semibold-600 mb-6 text-white">
                Customer Service
              </h3>
              <ul className="space-y-3">
                {customerLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-black-light hover:text-primary transition-colors duration-300 font-montserrat-regular-400 text-[14px]"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-12 pt-8 border-t border-black-light">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    {info.icon}
                  </div>
                  <div>
                    <p className="font-montserrat-medium-500 text-[14px] text-black-light">
                      {info.title}
                    </p>
                    <p className="text-black-light font-montserrat-regular-400 text-[13px]">
                      {info.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-12 pt-8 border-t border-black-light">
            <div className="text-center mb-4">
              <h3 className="text-sm font-montserrat-semibold-600 text-black-light mb-4">
                Certified & Trusted
              </h3>
              <div className="flex items-center justify-center gap-8">
                <div className="group">
                  <img 
                    src={giaLogo} 
                    alt="GIA Certified" 
                    className="h-12 md:h-16 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300 filter  hover:grayscale-0"
                  />
                </div>
                <div className="group">
                  <img 
                    src={igiLogo} 
                    alt="IGI Certified" 
                    className="h-12 md:h-16 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300 filter  hover:grayscale-0"
                  />
                </div>
              </div>
              <p className="text-xs text-black-light font-montserrat-regular-400 mt-3">
                Our diamonds and gemstones are certified by leading gemological institutes
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-black-light">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-black-light font-montserrat-regular-400 text-[14px]">
              &copy; {new Date().getFullYear()} Aurora Jewelry. All rights
              reserved.
            </div>

          

            <div className="flex items-center space-x-1 text-black-light font-montserrat-regular-400 text-[14px]">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-primary fill-current" />
              <span>for jewelry lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
