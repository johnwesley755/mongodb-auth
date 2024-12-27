import express from "express";
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from "../controllers/AuthController.js";
import UserAuth from "../middleware/UserAuth.js";

const authrouter = express.Router();

// Define routes
authrouter.post("/register", register);
authrouter.post("/login", login);
authrouter.post("/logout", logout);
authrouter.post("/send-verify-otp", UserAuth, sendVerifyOtp);
authrouter.post("/verify-account", UserAuth, verifyEmail);
authrouter.get("/is-auth", UserAuth, isAuthenticated);
authrouter.post('/send-reset-otp', sendResetOtp);
authrouter.post('/reset-password', resetPassword);
export default authrouter;
