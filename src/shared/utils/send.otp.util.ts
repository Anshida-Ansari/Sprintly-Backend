import nodemailer from "nodemailer";
import env from "src/infrastructure/providers/env/env.validation";

export const sendOtpEmail = async (email: string, otp: number) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Your OTP Code</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f0f2f5;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      }
      .header {
        background: linear-gradient(90deg, #4f46e5, #3b82f6);
        color: #ffffff;
        padding: 30px 20px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
      }
      .body {
        padding: 40px 30px;
        text-align: center;
      }
      .greeting {
        font-size: 18px;
        color: #111827;
        margin-bottom: 20px;
      }
      .otp {
        display: inline-block;
        background: #f3f4f6;
        border-radius: 8px;
        font-size: 36px;
        font-weight: bold;
        letter-spacing: 6px;
        padding: 15px 40px;
        margin-bottom: 15px;
        color: #111827;
      }
      .instruction {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 25px;
      }
      .expiry {
        font-size: 13px;
        color: #ef4444;
        margin-bottom: 25px;
      }
      .footer {
        font-size: 12px;
        color: #9ca3af;
        background: #f9fafb;
        padding: 15px 20px;
        text-align: center;
        border-top: 1px solid #e5e7eb;
      }
      a {
        color: #4f46e5;
        text-decoration: none;
      }
      @media (max-width: 480px) {
        .otp {
          font-size: 28px;
          padding: 12px 30px;
        }
        .header {
          font-size: 20px;
          padding: 20px 10px;
        }
        .body {
          padding: 30px 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Sprintly</div>
      <div class="body">
        <div class="greeting">Hello,</div>
        <div class="instruction">
          Use the OTP below to verify your email address.
        </div>
        <div class="otp">${otp}</div>
        <div class="expiry">This OTP is valid for <strong>3 minutes</strong>.</div>
        <div class="instruction">
          If you did not request this, please ignore this email.
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Sprintly. All rights reserved. | 
        <a href="mailto:support@sprintly.com">Support</a>
      </div>
    </div>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: `Sprintly <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification OTP - Sprintly",
    html: htmlTemplate,
  });
};
