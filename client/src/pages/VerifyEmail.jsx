import { assets } from '@/assets/assets';
import React, { useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { AppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const VerifyEmail = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const inputRefs = React.useRef([]);
  const {backendUrl, isLoggedIn, userData, getUserData} = useContext(AppContext);

  const handleInput = (e, index) => {
    // Check input value length and focus next input field
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    // Check for backspace key and focus previous input field
    if (e.key === 'Backspace' && index > 0 && e.target.value === '') {
      inputRefs.current[index - 1].focus();
    }
  }

const handlePaste = (e) => {
  e.preventDefault(); // Prevent default paste behavior
  const paste = e.clipboardData.getData("text");
  const pasteArray = paste.split("");

  pasteArray.forEach((char, index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].value = char; // Set the value of the input field
      // Automatically focus the next input field if it exists
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  });
};

const onSubmitHandler = async(e) => {
  try{
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value);
    const otp = otpArray.join("");
    const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp});
    if(data.success){
      toast.success(data.message);
      getUserData();
      navigate('/');
    } 
    else{
      toast.error(error.message);
    }
  }
  catch(error) {

  }
}
useEffect(() => {
  if (isLoggedIn && userData && userData.isAccountVerified === true) {
    navigate('/');
  }
}, [isLoggedIn, userData]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400" onPaste={handlePaste}>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo" 
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit code sent to your email ID
        </p>
        <div className="flex justify-between mb-8">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength={1}
                key={index}
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center rounded border border-indigo-300 focus:outline-none focus:border-indigo-500 text-xl font-semibold"
                ref={(el) => {
                  inputRefs.current[index] = el; // Corrected `ref` parameter to avoid confusion
                }}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              
              />
            ))}
        </div>
        <Button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-900 text-white rounded-full">
          Verify Email
        </Button>
      </form>
    </div>
  );
};

export default VerifyEmail;
