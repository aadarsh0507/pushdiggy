// src/pages/Splash.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo.png";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000); // 3 sec delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <img
        src={logo}
        alt="Company Logo"
        className="w-30 h-60 animate-ping-slow"
      />
    </div>
  );
};

export default Splash;
