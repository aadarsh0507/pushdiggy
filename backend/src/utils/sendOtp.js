import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

// Check if credentials are set
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ EMAIL_USER or EMAIL_PASS is not set in environment variables.');
  process.exit(1); // Exit the server if credentials are missing
}

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Optional: verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error connecting to email server:', error);
  } else {
    console.log('✅ Email transporter is ready.');
  }
});

// Send OTP function
export async function sendOtp(email, otp) {
  try {
    const info = await transporter.sendMail({
      from: `"PushDiggy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`
    });
    console.log(`✅ OTP email sent to ${email}: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send OTP to ${email}:`, error);
    throw error;
  }
}
