import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Shop from "../pages/Shop";
import Favorites from "../pages/Favorites";
import Rings from "../pages/Rings";
import Earrings from "../pages/Earrings";
import Bracelets from "../pages/Bracelets";
import Necklaces from "../pages/Necklaces";
import ViewCart from "../pages/ViewCart";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard";
import SizeGuide from "../pages/SizeGuide";
import JewelryCare from "../pages/JewelryCare";
import FAQ from "../pages/FAQ";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import ShippingInfo from "../pages/ShippingInfo";
import ReturnsExchanges from "../pages/ReturnsExchanges";
import NotFound from "../pages/NotFound";
import Discover from "../pages/Discover";
import Gallery from "../pages/Gallery";
import ProductDetail from "../pages/ProductDetail";
import CartProductDetail from "../pages/CartProductDetail";
import ScrollToTop from "../helpers/ScrollToTop";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "../components/ProtectedRoute";
import AuthRedirect from "../components/AuthRedirect";
import CurrencyTestPage from "../pages/CurrencyTestPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
     
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart/product/:cartItemId" element={<CartProductDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rings" element={<Rings />} />
          <Route path="/earrings" element={<Earrings />} />
          <Route path="/bracelets" element={<Bracelets />} />
          <Route path="/necklaces" element={<Necklaces />} />
          <Route path="/view-cart" element={<ViewCart />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/jewelry-care" element={<JewelryCare />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping-info" element={<ShippingInfo />} />
          <Route path="/returns-exchanges" element={<ReturnsExchanges />} />
          <Route path="/currency-test" element={<CurrencyTestPage />} />
          
          {/* Protected Routes - Require Authentication */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Route>

        {/* <Route element={<AuthLayout />}> */}
          <Route path="/sign-in" element={<AuthRedirect><SignIn /></AuthRedirect>} />
          <Route path="/sign-up" element={<AuthRedirect><SignUp /></AuthRedirect>} />
          <Route path="/forgot-password" element={<AuthRedirect><ForgotPassword /></AuthRedirect>} />
          <Route path="/reset-password" element={<AuthRedirect><ResetPassword /></AuthRedirect>} />
        {/* </Route> */}

        <Route element={<MainLayout />}>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        </Route>

        {/* 404 Route - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
          <ScrollToTop/>
          <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontFamily: 'Montserrat, sans-serif',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
};

export default AppRoutes;
