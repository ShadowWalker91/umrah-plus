'use server';

import nodemailer from 'nodemailer';

export async function sendTransportEmail(formData: {
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
}) {
  try {
    // Configure the email transport using your SMTP credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Change this if you use Outlook, Hostinger, etc.
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, 
      },
    });

    // Define the email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.OFFICIAL_EMAIL, // The email receiving the leads
      subject: `New Transport Booking Request - Umrah Plus`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111;">
            <h2 style="color: #F9C344; background: #000; padding: 10px; border-radius: 5px;">New Transport Booking Request</h2>
            <p>A new booking request has been submitted from the Umrah Plus homepage:</p>
            <table style="width: 100%; max-width: 500px; border-collapse: collapse; margin-top: 20px;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Pickup Location:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${formData.pickup}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Dropoff Location:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${formData.dropoff}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Date:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${formData.date}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Time:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${formData.time}</td>
                </tr>
            </table>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    return { success: true };

  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: "Failed to send email" };
  }
}