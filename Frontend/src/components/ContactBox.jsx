import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { IoLogoWhatsapp } from 'react-icons/io';

const ContactBox = () => {
  const handleEmailClick = () => {
    window.location.href = 'mailto:kivadiamond3008@gmail.com';
  };

  const handleWhatsAppClick = () => {
    window.open('https://api.whatsapp.com/send/?phone=919106302269&text&type=phone_number&app_absent=0', '_blank');
  };

  const handleCallClick = () => {
    window.location.href = 'tel:+919106302269';
  };

  return (
    <div className=" border border-primary rounded-lg p-4 mt-6">
      <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2 text-center">
        Have questions for our team?
      </h3>
      <div className="flex items-center justify-center space-x-6">
        {/* Email */}
        <button
          onClick={handleEmailClick}
          className="flex flex-col items-center space-y-2 p-2 rounded-lg  transition-colors duration-300 group"
          aria-label="Send Email"
        >
          {/* <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center group-hover:bg-primary-dark transition-colors duration-300"> */}
            <Mail className="w-6 h-6 text-blue-500" />
          {/* </div> */}
          {/* <span className="text-sm font-montserrat-medium-500 text-black">Email</span> */}
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsAppClick}
          className="flex flex-col items-center space-y-2 p-2 rounded-lg  transition-colors duration-300 group"
          aria-label="Contact via WhatsApp"
        >
          {/* <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center group-hover:bg-primary-dark transition-colors duration-300"> */}
            <IoLogoWhatsapp className="w-7 h-7 text-green-500" />
          {/* </div> */}
          {/* <span className="text-sm font-montserrat-medium-500 text-black">WhatsApp</span> */}
        </button>

        {/* Call */}
        <button
          onClick={handleCallClick}
          className="flex flex-col items-center space-y-2 p-2 rounded-lg  transition-colors duration-300 group"
          aria-label="Call Us"
        >
          {/* <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center group-hover:bg-primary-dark transition-colors duration-300"> */}
            <Phone className="w-6 h-6  text-black" />
          {/* </div> */}
          {/* <span className="text-sm font-montserrat-medium-500 text-black">Call</span> */}
        </button>
      </div>
    </div>
  );
};

export default ContactBox;

