import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const backendUrl = "http://localhost:4000"; // Replace with your backend URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Reset Password
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter your email address, and we'll send you a reset link.
        </p>
        <div className="mb-8">
          <label htmlFor="email" className="block text-white mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 bg-[#333A5C] text-white rounded border border-indigo-300 focus:outline-none focus:border-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-900 text-white rounded-full">
          Send Reset Email
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
