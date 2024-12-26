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

    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      return res.status(400).json({success:false, message:"User is already verified"});
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Hello ${user.name},\n\nPlease use the following OTP to verify your account: ${otp} for your email: ${user.email}\n\nBest regards,\nYour Platform Team`,
    };

    await transporter.sendMail(mailOptions);    

    res.json({ success: true, message: "Verification OTP sent on Email successfully" });
  }
catch(error){
    res.json({success:false, message:error.message})
  }
}


 // OTP verification
export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;

    if(!userId || !otp){
        return res.status(400).json({success:false, message:"User Id and OTP are required"});
    }
    try{
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }
        if(user.isAccountVerified){
            return res.status(400).json({success:false, message:"User is already verified"});
        }
        if(user.verifyOtp !== otp || user.verifyOtp === ''){
            return res.status(400).json({success:false, message:"Invalid OTP"});
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return res.status(400).json({success:false, message:"OTP expired"});
        }
        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.json({success:true, message:"Email verified successfully"});
    }
    catch(error){
        return res.json({success:false, message:error.message})
    }
}
 
//Check if user is authenticated
export const isAuthenticated = async(req,res) =>{
    try{
        return res.json({success:true});
       }
    catch(error){
        res.json({success:false, message:error.message})
    }
}

// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
  const {email} = req.body;
  if(!email){
    return res.json({success:false, message:'Email is required'})
  }
  try{
    const user = await userModel.findOne({email});
    if(!user){
      return res.json({success:false, message:'User not found'});
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Hello ${user.name},\n\nPlease use the following OTP to reset your password: ${otp} for your email: ${user.email}\n\nBest regards,\nYour Platform Team`,
    };    
    await transporter.sendMail(mailOptions);

    return res.json({success: true, message: "Password Reset OTP sent on Email successfully"}); 
  }
  catch(error){
    return res.json({success: false, message: error.message});
  }
}

// Reset User Password
export const resetPassword = async (req, res) => {
  const {email, otp, newPassword} = req.body;
  if(!email || !otp || !newPassword){
    return res.json({success:false, message:'Email, OTP and New Password are required'});
  }
  try{
    const user = await userModel.findOne({email});
    if(!user){
      return res.json({success:false, message:'User not found'});
    }
    if(user.resetOtp !== otp || user.resetOtp === ''){
      return res.json({success:false, message:'Invalid OTP'});
    }
    if(user.resetOtpExpireAt < Date.now()){
      return res.json({success:false, message:'OTP expired'});
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();
    return res.json({success: true, message: "Password reset successfully"});
  }
  catch(error){
    return res.json({success: false, message: error.message});  
  }
  }