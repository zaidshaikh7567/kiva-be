import React, { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react"; // lucide-react icons

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 py-4 bg-white shadow-sm">
      {/* Logo */}
      <div className="text-xl font-serif text-[#c39d8f]">Aurora</div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex space-x-8 text-[#1e2b38] font-medium">
        <a
          href="#trending"
          className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
        >
          Trending
        </a>{" "}
        <a
          href="#collection"
          className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
        >
          Collection
        </a>{" "}
        <a
          href="#testimonials"
          className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
        >
          Testimonials
        </a>{" "}
        <a
          href="#contact"
          className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
        >
          Contact Us
        </a>
      </nav>
      <div className="relative hidden md:flex">
        <ShoppingBag className="w-6 h-6 text-[#1e2b38]" />
        <span className="absolute -top-2 -right-2 bg-[#c39d8f] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          6
        </span>
      </div>
      {/* Mobile Menu Button + Cart */}
      <div className="flex items-center gap-4 md:hidden">
        {/* Cart */}
        <div className="relative">
          <ShoppingBag className="w-6 h-6 text-[#1e2b38]" />
          <span className="absolute -top-2 -right-2 bg-[#c39d8f] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            6
          </span>
        </div>
        {/* Sidebar toggle */}
        <button onClick={() => setIsOpen(true)} className="p-2">
          <Menu className="w-7 h-7 text-[#1e2b38]" />
        </button>

      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="absolute top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-lg p-6">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-6 h-6 text-[#1e2b38]" />
            </button>

            {/* Sidebar Links */}
            <div className="text-xl font-serif text-[#c39d8f]">Aurora</div>

            <nav className="mt-10 flex flex-col space-y-6 text-lg text-[#1e2b38]">
              <a
                href="#trending"
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
              >
                Trending
              </a>
              <a
                href="#collection"
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
              >
                Collection
              </a>
              <a
                href="#testimonials"
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
              >
                Testimonials
              </a>
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
              >
                Contact Us
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
