import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import StickyCartButton from "../components/StickyCartButton";
import HelpSupportButton from "../components/HelpSupportButton";
import ComingSoon from "../components/home/ComingSoon";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchStones } from "../store/slices/stonesSlice";
import { fetchMetals } from "../store/slices/metalsSlice";

const MainLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStones());
    dispatch(fetchMetals());
  }, [dispatch]);

  // Uncomment the line below to show Coming Soon page instead of the main site
  // return <ComingSoon />;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Cart />
      <StickyCartButton />
      {/* <HelpSupportButton /> */}
    </div>
  );
};

export default MainLayout;
