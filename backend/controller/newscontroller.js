import News from "../models/newsmodel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import transporter from "../config/nodemailer.js";
import { getNewsletterTemplate } from "../email.js";

const submitNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    const newNewsletter = new News({ email });
    const savedNewsletter = await newNewsletter.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Zaroori Zameen Newsletter! 🏠",
      html: getNewsletterTemplate(email),
    };


    await transporter.sendMail(mailOptions);

    res.json({ message: "Newsletter submitted successfully" });
  } catch (error) {
    console.error("Error saving newsletter data:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export { submitNewsletter };
