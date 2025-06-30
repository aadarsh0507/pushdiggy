// src/utils/sendOtp.js
import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

// ✅ Define transporter at the top
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Optional: verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error connecting to email server:', error);
  } else {
    console.log('✅ Email transporter is ready.');
  }
});

// ✅ Exported sendOtp function with complete message
export async function sendOtp(email, otp) {
  try {
    const info = await transporter.sendMail({
      from: `"Push Diggy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Push Diggy - Registration OTP Verification',
      text: `
Dear Applicant,

Congratulations! You have been registered successfully on Push Diggy!

Please go through the below-mentioned points before proceeding with your account activation:

1. Please ensure that the details entered in the GET STARTED Application Form are correct before LOGIN.

User Name - ${email}

2. You can reset by yourself after logging.

3. For any clarification, you may contact our Toll Free Number: +91-8608706864, which is available 24X7, assisting in 3 languages.

4. For updates about Push Diggy, go to the 'Push Diggy' link in the Media Corner on the website.

OTP for Email verification: ${otp}

Please do not share with anyone.

Best regards,  
Push Diggy Communications Team

Note: This is a system generated e-mail, please do not reply to it.

This message has been analyzed by Push Diggy Security
      `.trim()
    });

    console.log(`✅ OTP email sent to ${email}: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send OTP to ${email}:`, error);
    throw error;
  }
}
