import express from "express";
import { isAuthenticated, login, logout, register, sendVerifyOtp, verifyEmail } from "../controllers/AuthController.js";
import UserAuth from "../middleware/UserAuth.js";

const authrouter = express.Router();

// Define routes
authrouter.post("/register", register);
authrouter.post("/login", login);
authrouter.post("/logout", logout);
authrouter.post("/send-verify-otp", UserAuth, sendVerifyOtp);
authrouter.post("/verify-account", UserAuth, verifyEmail);
authrouter.post("/is-auth", UserAuth, isAuthenticated);
export default authrouter;
