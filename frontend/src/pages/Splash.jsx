// src/pages/Splash.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo.png";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Set flag to indicate user came from splash screen
      sessionStorage.setItem('fromSplash', 'true');
      navigate("/home");
    }, 3000); // 3 sec delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <img
          src={logo}
          alt="Push Diggy Logo"
          className="w-30 h-60 animate-ping-slow mx-auto"
        />
      </div>
    </div>
  );
};

export default Splash;
