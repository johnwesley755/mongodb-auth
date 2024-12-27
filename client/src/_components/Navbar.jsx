import React, { useContext } from "react";
import { assets } from "../assets/assets.js";
import { Button } from "@/components/ui/button.jsx";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
    const navigate = useNavigate();
    const {userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext);
    const sendverificationOtp = async () => {
      try{
        axios.defaults.withCredentials = true;
        const {data} = await axios.post(backendUrl + '/api/auth/send-otp');
        if(data.success){
          toast.success(data.message);
          navigate('/verify-email');
          toast.success(data.message);
        }else{
          toast.error(data.message);
        }
      }
      catch(error){
        toast.error(error.message);
      }
    }
    const logout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const {data} = await axios.post(backendUrl + '/api/auth/logout');
            data.success && setIsLoggedIn(false);
            data.success && setUserData(false);
            navigate('/')
          }
        catch (error) {
          toast.error(error.message);
        }
    }
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-50">
      {/* Logo */}
      <img
        src={assets.logo}
        alt="logo"
        className="h-10 sm:h-12 cursor-pointer"
      />
      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
             {!userData.isAccountVerified &&  <li onClick={sendverificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                Verify Email
              </li>}
              <li className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">
                Reset Password
              </li>
              <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"> Logout</li>
            </ul>
          </div>
        </div>
      ) : (
        <Button onClick={() => navigate("/login")}>
          Login
          <img
            src={assets.arrow_icon}
            alt=""
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
          />
        </Button>
      )}

      {/* Button */}
    </div>
  );
};

export default Navbar;
