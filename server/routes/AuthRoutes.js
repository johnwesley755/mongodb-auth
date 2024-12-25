import express from "express";
import { login, logout, register } from "../controllers/AuthController.js";

const authrouter = express.Router();

// Define routes
authrouter.post("/register", register);
authrouter.post("/login", login);
authrouter.post("/logout", logout);

export default authrouter;
