import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Heart, ArrowUp } from "lucide-react";
import { FaFacebook, FaInstagram,FaWhatsapp  } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import giaLogo from "../assets/icon/gia.svg";
import igiLogo from "../assets/icon/igi.svg";
import Logo from '../assets/images/kiva-diamond-logo.png'
import { IoLogoWhatsapp } from "react-icons/io";
import { RiInstagramFill } from "react-icons/ri";
const Footer = () => {
  const FACEBOOK_URL = import.meta.env.VITE_FACEBOOK_URL;
  const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL;
  const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL;
  const EMAIL_URL = import.meta.env.VITE_EMAIL_URL;
  const PHONE_NUMBER_COMBO = import.meta.env.VITE_NUMBER_COMBO;
  const PHONE_NUMBER_SEPARATE = import.meta.env.VITE_NUMBER_SEPARATE;
  const navigate = useNavigate();
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setShowScrollToTop(scrollY > 300); // Show button after scrolling 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }; 
  // Social Media Links
  const socialLinks = [
    { icon: <FaFacebook className="w-5 h-5 text-white" />, href: FACEBOOK_URL, label: "Facebook" },
    { icon: <RiInstagramFill className="w-5 h-5 text-white" />, href: INSTAGRAM_URL, label: "Instagram" },
    { icon: <IoLogoWhatsapp className="w-5 h-5 text-white" />, href: WHATSAPP_URL, label: "Twitter" },
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
    { href: "/#reviews", text: "Reviews" },
    { href: "/shipping-info", text: "Shipping Info" },
    { href: "/size-guide", text: "Size Guide" },
    { href: "/jewelry-care", text: "Jewelry Care" },
    { href: "/faq", text: "FAQ" },
    { href: "/privacy-policy", text: "Privacy Policy" },
  ];
// +1 306 361 9759
  // Contact Info
const contactInfo = [
  {
    icon: <Phone className="w-5 h-5 text-white" />,
    title: "Phone",
    value: `${PHONE_NUMBER_SEPARATE}`,
    link: `tel:${PHONE_NUMBER_COMBO}`,
  },
  {
    icon: <Mail className="w-5 h-5 text-white" />,
    title: "Email",
    value: EMAIL_URL,
    link: `mailto:${EMAIL_URL}`,
  },
  {
    icon: <MapPin className="w-5 h-5 text-white" />,
    title: "Address",
    value:
      "3rd floor above Krishna Hospital, Near Piplas Char Rasta, Katargam Main Road, Surat, 395004 (India)",
    link: "https://www.google.com/maps?q=Krishna+Hospital,+Katargam,+Surat+395004",
  },
];

  return (
    <footer className="text-white bg-primary-light">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-16">
        {/* Main Footer Content */}
        <div className="pt-12 pb-6 sm:pt-16">
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
                    target="_blank"
                    rel="noopener noreferrer"
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
              <h3 className="text-base sm:text-lg font-montserrat-semibold-600 mb-4 sm:mb-4 text-white">
                Quick Links
              </h3>
              <ul className="space-y-2 sm:space-y-2">
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
              <h3 className="text-base sm:text-lg font-montserrat-semibold-600 mb-4 sm:mb-4 text-white">
                Customer Service
              </h3>
              <ul className="space-y-2 sm:space-y-2">
                {customerLinks.map((link, index) => {
                  // Handle hash links (like #reviews) specially
                  const isHashLink = link.href.startsWith('/#');
                  if (isHashLink) {
                    return (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-black-light hover:text-primary transition-colors duration-300 font-montserrat-regular-400 text-sm sm:text-[14px]"
                          onClick={(e) => {
                            // If not on home page, navigate first
                            if (window.location.pathname !== '/') {
                              e.preventDefault();
                              navigate(link.href);
                            }
                          }}
                        >
                          {link.text}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-black-light hover:text-primary transition-colors duration-300 font-montserrat-regular-400 text-sm sm:text-[14px]"
                      >
                        {link.text}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 sm:mt-6 pt-4 sm:pt-4 border-t border-black-light flex justify-center md:justify-between w-full">
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

            {/* Make the value clickable */}
            <a
              href={info.link}
              target={info.title === "Address" ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="text-black-light font-montserrat-regular-400 text-xs sm:text-[13px] break-words hover:text-primary transition-colors"
            >
              {info.value}
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>

          {/* Certifications */}
          <div className="mt-4 pt-4 sm:pt-4 border-t border-black-light">
            <div className="text-center">
              <h3 className="text-xs sm:text-sm font-montserrat-semibold-600 text-black-light mb-2">
                Certified & Trusted
              </h3>
              <div className="flex items-center justify-center gap-4 sm:gap-8">
                <div className="group">
                  <img 
                    src={giaLogo} 
                    alt="GIA Certified" 
                    className="h-10 sm:h-10 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300 filter hover:grayscale-0"
                  />
                </div>
                <div className="group">
                  <img 
                    src={igiLogo} 
                    alt="IGI Certified" 
                    className="h-10 sm:h-10 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300 filter hover:grayscale-0"
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
        <div className="py-4 sm:py-8 border-t border-black-light">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 text-center sm:text-left">
            <div className="text-black-light font-montserrat-regular-400 text-xs sm:text-[14px]">
              &copy; {new Date().getFullYear()} Kiva Diamond. All rights reserved.
            </div>
            <div className="flex items-center space-x-1 text-black-light font-montserrat-regular-400 text-xs sm:text-[14px]">
              <span>Made with</span>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-primary fill-current" />
              <span>for jewelry lovers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-black-light hover:bg-black text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      )}
    </footer>
  );
};

export default Footer;