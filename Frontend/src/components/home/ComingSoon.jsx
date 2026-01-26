import React, { useEffect, useState } from 'react';
import Logo from '../../assets/images/kiva-diamond-logo.png';
import { IoLogoWhatsapp } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
const ComingSoon = () => {
  const [isVisible, setIsVisible] = useState(false);
  const FACEBOOK_URL = import.meta.env.VITE_FACEBOOK_URL;
  const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL;
  const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL;
  const socialLinks = [
    { icon: <IoLogoWhatsapp className="w-10 h-10 text-white" />, href: WHATSAPP_URL, label: "WhatsApp" },
    { icon: <FaFacebook className="w-10 h-10 text-white" />, href: FACEBOOK_URL, label: "Facebook" },
    { icon: <RiInstagramFill className="w-10 h-10 text-white" />, href: INSTAGRAM_URL, label: "Instagram" },
  ];
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-neutral-900 to-black text-white">
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-xl w-full text-center space-y-8">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-primary/5 rounded-full blur-lg"></div>
          
          {/* Diamond-shaped decorative elements */}
          <div 
            className="absolute top-20 right-20 w-8 h-8 bg-primary/20 rotate-45 z-0"
            style={{
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
            }}
          ></div>
          <div 
            className="absolute bottom-32 left-16 w-6 h-6 bg-primary/25 rotate-45 z-0"
            style={{
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
            }}
          ></div>
          
          {/* Sparkle decorative elements */}
          <div className="absolute top-24 right-12 w-2 h-2 bg-primary/40 rotate-45 z-0"></div>
          <div className="absolute bottom-28 left-20 w-1 h-1 bg-primary/50 rotate-45 z-0"></div>
          <div className="absolute top-40 left-12 w-1 h-1 bg-primary/35 rotate-45 z-0"></div>

          {/* Logo */}
          <div 
            className={`flex justify-center transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="rounded-full flex items-center justify-center">
              <img
                src={Logo}
                alt="KIVA Diamond Logo"
                className="h-[100px] w-auto"
                style={{
                  filter: 'brightness(1.1) contrast(1.1)'
                }}
              />
            </div>
          </div>

          {/* Title */}
          <h1 
            className={`text-4xl sm:text-5xl md:text-6xl font-sorts-mill-gloudy tracking-tight transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            Kiva Diamond<span className="text-primary">.</span>
          </h1>

          {/* Subtitle */}
          <p 
            className={`text-xl sm:text-2xl text-neutral-300 font-montserrat-medium-500 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            Our website is launching soon
          </p>

          {/* Divider */}
          <div 
            className={`h-px bg-neutral-700 w-24 mx-auto transition-all duration-700 ${
              isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
            style={{ transitionDelay: '700ms' }}
          />

          {/* Description */}
          <p 
            className={`text-neutral-400 leading-relaxed font-montserrat-regular-400 text-base sm:text-lg transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '900ms' }}
          >
            We're crafting something brilliant ✨<br />
            Stay tuned for premium diamond jewelry designed with elegance and precision.
          </p>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div 
              className={`flex space-x-3 sm:space-x-4 justify-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '1100ms' }}
            >
              {socialLinks.map((item, index) => (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                  href={item.href}
                  aria-label={item.label}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-primary/20 hover:bg-primary/30 transition-all duration-300 hover:scale-110"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          )}

          {/* Copyright */}
          <p 
            className={`text-sm text-neutral-500 pt-2 font-montserrat-regular-400 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '1300ms' }}
          >
            © {new Date().getFullYear()} Kiva Diamond. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ComingSoon;

