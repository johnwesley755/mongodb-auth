import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authrouter from "./routes/AuthRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
  });

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    credentials: true,
  })
);

// API Endpoints
app.get("/", (req, res) => {
  res.send("API Working");
});

app.use("/api/auth", authrouter); // Mount the auth routes

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
