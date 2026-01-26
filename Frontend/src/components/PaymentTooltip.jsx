import React from 'react';
import { AlertCircle } from 'lucide-react';

const PaymentTooltip = ({ 
  isVisible, 
  whatsappUrl, 
  title = "Payment System Under Development",
  description = "Our online payment system is currently being developed. We apologize for any inconvenience.",
  contactLabel = "For placing orders or payment assistance:",
  buttonText = "Contact us on WhatsApp",
  footerMessage = "Thank you for your patience and support.",
  position = "bottom", // 'top', 'bottom', 'left', 'right'
  className = ""
}) => {
  if (!isVisible) return null;

  // Position classes based on position prop
  const positionClasses = {
    bottom: "top-full mt-3 left-1/2 -translate-x-1/2",
    top: "bottom-full mb-3 left-1/2 -translate-x-1/2",
    left: "right-full mr-3 top-1/2 -translate-y-1/2",
    right: "left-full ml-3 top-1/2 -translate-y-1/2"
  };

  // Arrow position classes
  const arrowClasses = {
    bottom: "absolute left-1/2 -top-2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-primary",
    top: "absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-primary",
    left: "absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-primary",
    right: "absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-primary"
  };

  return (
    <div className={`
      absolute 
      z-50
      ${positionClasses[position]}
      w-[90vw] 
      max-w-md
      bg-white
      border-2
      border-primary
      text-black 
      text-sm 
      px-5 
      py-4 
      rounded-2xl
      shadow-xl
      ${className}
    `}>
      {/* Header Section */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="flex-shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-montserrat-semibold-600 text-base text-black mb-1">
            {title}
          </h3>
          <p className="text-sm text-black-light font-montserrat-regular-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Contact Section */}
      {whatsappUrl && (
        <div className="space-y-3">
          <p className="text-sm font-montserrat-medium-500 text-black">
            {contactLabel}
          </p>
          <a 
            href={whatsappUrl} 
            target='_blank' 
            rel='noopener noreferrer'
            className="flex items-center space-x-3 bg-[#25D366] hover:bg-[#20BA5A] text-white px-4 py-3 rounded-lg transition-colors duration-300 group"
          >
            <svg 
              className="w-5 h-5 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.77.966-.94 1.164-.17.199-.34.223-.63.075-.29-.15-1.222-.451-2.33-1.437-.861-.781-1.443-1.744-1.612-2.038-.17-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span className="font-montserrat-medium-500 text-sm flex-1 text-left">
              {buttonText}
            </span>
            <svg 
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}

      {/* Footer Message */}
      {footerMessage && (
        <p className="text-xs text-black-light font-montserrat-regular-400 mt-4 text-center italic">
          {footerMessage}
        </p>
      )}

      {/* Arrow */}
      <div className={arrowClasses[position]} />
    </div>
  );
};

export default PaymentTooltip;

