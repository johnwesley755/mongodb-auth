import React, { useState } from 'react'
import { assets } from '@/assets/assets'
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '@/context/AppContext';
import { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState('Sign Up');
  const[name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {backendUrl, setIsLoggedIn, getUserData} = useContext(AppContext);
 
const onSubmitHandler = async (e) => {
  try {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    if (state === "Sign Up") {
      const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
        name,
        email,
        password,
      });

      if (data.success) {
        setIsLoggedIn(true);
        getUserData()
        navigate("/");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } else {
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });

      if (data.success) {
        setIsLoggedIn(true);
        getUserData()
        navigate("/");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    }
  } catch (error) {
    // Extract error message safely
    const errorMessage =
      error.response?.data?.message || "An error occurred. Please try again.";
    toast.error(errorMessage);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-bold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account"}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                className="bg-transparent outline-none text-white"
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              className="bg-transparent outline-none text-white"
              type="email"
              placeholder="Enter your Email id"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              className="bg-transparent outline-none text-white"
              type="password"
              placeholder="Create new password"
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p onClick={() => navigate('/reset-password')} className="mb-4 text-indigo-500 cursor-pointer">
            Forgot Password?
          </p>
          <Button className="w-full py-2.5 rounded-full font-medium bg-gradient-to-r from-indigo-500 to-indigo-900 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-600">
            {state}
          </Button>
        </form>
        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account? {""}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account? {""}
            <span
              className="text-blue-400 cursor-pointer underline"
              onClick={() => setState("Sign Up")}
            >
              Signup
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login