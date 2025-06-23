import express from "express";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import validator from "validator";
import crypto from "crypto";
import userModel from "../models/Usermodel.js";
import transporter from "../config/nodemailer.js";
import { getWelcomeTemplate } from "../email.js";
import { getPasswordResetTemplate } from "../email.js";

const backendurl = process.env.BACKEND_URL;

const createtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

dotenv.config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const Registeruser = await userModel.findOne({ email });

    if (!Registeruser) {
      return res.json({ message: "Oops! Something went wrong", success: false });
    }

    const isMatch = await bcrypt.compare(password, Registeruser.password);

    if (isMatch) {
      // Update user's isActive status to true
      Registeruser.isActive = true;
      await Registeruser.save({ validateBeforeSave: false });

      const token = createtoken(Registeruser._id);

      // Store user ID in req object
      req.userId = Registeruser._id;

      return res.json({
        token,
        user: {
          id: Registeruser._id,
          name: Registeruser.name,
          email: Registeruser.email,
          isActive: Registeruser.isActive, // Optionally include in response
          hasCompletedQuestionnaire: Registeruser.hasCompletedQuestionnaire,
          role: Registeruser.role,
        },
        success: true
      });
    } else {
      return res.json({ message: "Oops! Something went wrong", success: false });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error", success: false });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, bio } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        success: false
      });
    }

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists. Please use a different email or login.",
        success: false
      });
    }

    // Validate password strength (optional)
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        success: false
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      bio
    });

    await newUser.save();
    const token = createtoken(newUser._id);

    // Send welcome email
    try {
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Welcome to Zaroori Zameen - Your Account Has Been Created",
        html: getWelcomeTemplate(name)
      };
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Continue even if email fails - don't fail registration
    }

    return res.status(201).json({
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      success: true,
      message: "Registration successful!"
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Server error during registration",
      success: false
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found", success: false });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 1 hour
    await user.save();
    const resetUrl = `${process.env.WEBSITE_URL}/reset/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset - Zaroori Zameen Security",
      html: getPasswordResetTemplate(resetUrl)
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token", success: false });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
    return res.status(200).json({ message: "Password reset successful", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const adminlogin = async (req, res) => {
  try {
    const { email, password, adminId } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD && adminId == process.env.ADMIN_Id) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, success: true });
    } else {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const logout = async (req, res) => {
  try {
    return res.json({ message: "Logged out", success: true });
  } catch (error) {
    console.error(error);
    return res.json({ message: "Server error", success: false });
  }
};

// get name and email

const getname = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    return res.json(user);
  }
  catch (error) {
    console.error(error);
    return res.json({ message: "Server error", success: false });
  }
}



// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select('-password -__v');
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};


// Update a user
// Update a user
const updateUser = async (req, res) => {
  try {
    const updates = {};

    // Dynamically add fields if they exist in the request body
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.phone) updates.phone = req.body.phone;
    if (req.body.bio) updates.bio = req.body.bio;
    if (req.body.role) updates.role = req.body.role;
    if (typeof req.body.isActive === 'boolean') updates.isActive = req.body.isActive;

    // Handle avatar upload
    if (req.file) {
      updates.avatar = `/uploads/${req.file.filename}`;
    }

    // Update user
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user,
      avatarUrl: updates.avatar // Return new avatar URL if changed
    });

  } catch (err) {
    console.error('Update error:', err);

    // Handle duplicate email
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({ message: "Validation error", errors });
    }

    res.status(500).json({
      message: "Server error during update",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};



export { login, register, forgotpassword, resetpassword, adminlogin, logout, getname, getUserById, getAllUsers, updateUser, deleteUser };