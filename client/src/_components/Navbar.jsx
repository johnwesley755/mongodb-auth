import React from "react";
import { assets } from "../assets/assets.js";
import { Button } from "@/components/ui/button.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-50">
      {/* Logo */}
      <img
        src={assets.logo}
        alt="logo"
        className="h-10 sm:h-12 cursor-pointer"
      />

      {/* Button */}
      <Button onClick={() => navigate("/login")}>
        Login
        <img
          src={assets.arrow_icon}
          alt=""
          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
        />
      </Button>
    </div>
  );
};

export default Navbar;
