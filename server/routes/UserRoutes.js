import express from "express";
import UserAuth from "../middleware/UserAuth.js";
import { getUserData } from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.get("/data", UserAuth, getUserData);

export default userRouter;