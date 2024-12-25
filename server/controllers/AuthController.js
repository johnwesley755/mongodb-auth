import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/UserModel.js";
import transporter from "../config/nodemailer.js";
// Signup auth
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing Details" });
  }

  // Validate password strength
  if (
    password.length < 8 ||
    !/\d/.test(password) ||
    !/[A-Za-z]/.test(password)
  ) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "Password must be at least 8 characters long and include a number and a letter.",
      });
  }

  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send welcome email

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to our platform",
        text: `Hello ${name},\n\nWelcome to our platform! We're excited to have you join us.\n\nBest regards,\nYour Platform Team and your account have successfully created with email id: ${email}`,
      };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }

    return res
      .status(201)
      .json({ success: true, message: "Registration successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and Password are required" });
  }

  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Send Verification OTP to the User's Email
export const sendVerifyOtp = async (req, res) => {
  try {
    const {userId} = req.body;
  }

  catch(error){
    res.json({success:false, message:error.message})
  }
}
