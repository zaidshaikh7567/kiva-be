import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import StickyCartButton from "../components/StickyCartButton";
import HelpSupportButton from "../components/HelpSupportButton";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchStones } from "../store/slices/stonesSlice";
import { fetchMetals } from "../store/slices/metalsSlice";
import Logo from '../assets/images/kiva-diamond-logo.png'
import { FaFacebook, FaInstagram,FaWhatsapp  } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { RiInstagramFill } from "react-icons/ri";
const MainLayout = () => {
   const FACEBOOK_URL = import.meta.env.VITE_FACEBOOK_URL;
  const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL;
  const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL;
 const socialLinks = [
   { icon: <IoLogoWhatsapp className="w-10 h-10 text-white" />, href: WHATSAPP_URL, label: "WhatsApp" },
    { icon: <FaFacebook className="w-10 h-10 text-white" />, href: FACEBOOK_URL, label: "Facebook" },
    { icon: <RiInstagramFill className="w-10 h-10 text-white" />, href: INSTAGRAM_URL, label: "Instagram" },
  ];
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-neutral-900 to-black text-white">

        {/* Coming Soon Section */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-xl w-full text-center space-y-8">

            {/* Logo / Brand */}
            <div className="flex justify-center">
              <div className=" rounded-full  flex items-center justify-center ">
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

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Kiva Diamond
            </h1>

            <p className="text-xl text-neutral-300">
              Our website is launching soon
            </p>

            {/* Divider */}
            <div className="h-px bg-neutral-700 w-24 mx-auto" />

            {/* Description */}
            <p className="text-neutral-400 leading-relaxed">
              We’re crafting something brilliant ✨
              Stay tuned for premium diamond jewelry designed with elegance and precision.
            </p>

            {/* Email Input */}

 <div className="flex space-x-3 sm:space-x-4 justify-center sm:justify-center">
                {socialLinks.map((item, index) => (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    key={index}
                    href={item.href}
                    aria-label={item.label}
                    className="w-9 h-9 sm:w-10 sm:h-10  rounded-full flex items-center justify-center  transition-colors duration-300"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            {/* Footer Note */}
            <p className="text-sm text-neutral-500 pt-2">
              © {new Date().getFullYear()} Kiva Diamond. All rights reserved.
            </p>

          </div>
        </main>
      </div>
      {/* <Header /> */}
      {/* <main className="flex-1"> */}
      {/* <Outlet /> Render child routes here */}
      {/* </main> */}
      {/* <Footer /> */}
      {/* <Cart /> */}
      {/* <StickyCartButton /> */}
      {/* <HelpSupportButton /> */}
    </div>
  );
};

export default MainLayout;
