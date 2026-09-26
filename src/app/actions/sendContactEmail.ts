'use server';

import nodemailer from 'nodemailer';

export async function sendContactEmail(formData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.OFFICIAL_EMAIL, 
      subject: `New Contact Inquiry: ${formData.subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111;">
            <h2 style="color: #F9C344; background: #000; padding: 10px; border-radius: 5px;">New Contact Message</h2>
            <p>A new message has been submitted from the Umrah Plus Contact page:</p>
            <table style="width: 100%; max-width: 600px; border-collapse: collapse; margin-top: 20px;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Name:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${formData.name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email Address:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">
                      <a href="mailto:${formData.email}">${formData.email}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone Number:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${formData.phone || 'Not provided'}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Subject:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${formData.subject}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; vertical-align: top;">Message:</td>
                    <td style="padding: 10px; border: 1px solid #ddd; white-space: pre-wrap;">${formData.message}</td>
                </tr>
            </table>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };

  } catch (error) {
    console.error("Contact email failed:", error);
    return { success: false, error: "Failed to send message" };
  }
}