import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Home from "../pages/Home";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
     
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        
        </Route>

        <Route element={<AuthLayout />}>
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/register" element={<Register />} /> */}
        </Route>

        <Route element={<MainLayout />}>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
