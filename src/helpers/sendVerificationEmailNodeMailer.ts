// /lib/emailService.ts
import nodemailer from "nodemailer";
import React from 'react';
import ReactDOMServer from 'react-dom/server'; // For server-side rendering of React components
import VerificationEmail from "../../email/verificationemail"; // Adjust the import based on your file structure
import { ApiResponse } from '@/types/ApiResponse';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendVerificationEmailNodeMailer(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Render the VerificationEmail component to an HTML string
   


    const response = await transporter.sendMail({
      from: 'Anonymous Chai', // Update with your sender's email
      to: email, // Recipient's email
      subject: 'Mystery Message Verification Code',
      html: `
      <Html lang="en">
      <Head>
        <title>Verification Code</title>
      </Head>
      <Section>
        <Row>
          <Heading as="h2">Hello ${username},</Heading>
        </Row>
        <Row>
          <Text>Thank you for registering. Please use the following verification code:</Text>
        </Row>
        <Row>
          <Text>${verifyCode}</Text>
        </Row>
        <Row>
          <Text>If you did not request this code, please ignore this email.</Text>
        </Row>
      </Section>
    </Html>
      
      
      `
    });

    console.log("Email sent:", response); // Log the response from sendMail
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}
