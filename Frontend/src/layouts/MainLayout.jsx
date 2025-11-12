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


const MainLayout = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet /> {/* Render child routes here */}
      </main>
      <Footer />
      <Cart />
      <StickyCartButton />
      {/* <HelpSupportButton /> */}
    </div>
  );
};

export default MainLayout;
