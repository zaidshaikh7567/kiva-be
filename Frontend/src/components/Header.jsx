import React, { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react"; // lucide-react icons
import { useSelector, useDispatch } from "react-redux";
import { openCart } from "../store/slices/cartSlice";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { totalQuantity } = useSelector(state => state.cart);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-16 xl:px-32 py-4 bg-white shadow-sm ">
      {/* Logo */}
      <Link to="/">
      <div className="text-xl font-serif text-primary">Aurora</div>
      </Link>
      {/* Desktop Nav */}
      <nav className="hidden lg:flex space-x-8 text-[#1e2b38] font-medium">       
        <Link
          to="/rings"
          className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
        >
          Rings
        </Link>{" "}
        <Link
          to="/earrings"
          className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
        >
          Earrings
        </Link>{" "}
        <Link
          to="/bracelets"
          className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
        >
          Bracelets
        </Link>{" "}
        <Link
          to="/necklaces"
          className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
        >
          Necklaces
        </Link>{" "}   
        <Link
          to="/about"
          className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
        >
          About
        </Link>{" "}    
        <Link
          to="/contact"
          className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
        >
          Contact Us
        </Link>
      </nav>
      <button 
        onClick={() => dispatch(openCart())}
        className="relative hidden md:flex hover:opacity-80 transition-opacity duration-300"
      >
        <ShoppingBag className="w-6 h-6 text-[#1e2b38]" />
        {totalQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {totalQuantity}
          </span>
        )}
      </button>
      {/* Mobile Menu Button + Cart */}
      <div className="flex items-center gap-4 md:hidden">
        {/* Cart */}
        <button 
          onClick={() => dispatch(openCart())}
          className="relative hover:opacity-80 transition-opacity duration-300"
        >
          <ShoppingBag className="w-6 h-6 text-[#1e2b38]" />
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {totalQuantity}
            </span>
          )}
        </button>
        {/* Sidebar toggle */}
        <button onClick={() => setIsOpen(true)} className="p-2">
          <Menu className="w-7 h-7 text-[#1e2b38]" />
        </button>

      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-lg p-6">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-6 h-6 text-[#1e2b38]" />
            </button>

            {/* Sidebar Links */}
            <div className="text-xl font-serif text-primary">Aurora</div>

            <nav className="mt-10 flex flex-col space-y-6 text-lg text-[#1e2b38]">                         
              <Link
                to="/rings"
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
              >
                Rings
              </Link>
              <Link
                to="/earrings"
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
              >
                Earrings
              </Link>
              <Link
                to="/bracelets"
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
              >
                Bracelets
              </Link>
              <Link
                to="/necklaces"
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
              >
                Necklaces
              </Link>   
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
              >
                About
              </Link>          
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
              >
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
