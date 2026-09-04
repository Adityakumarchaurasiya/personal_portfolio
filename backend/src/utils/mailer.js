const nodemailer = require("nodemailer");

let transporter;

async function getTransporter() {
  if (transporter) return transporter;

  const hasSmtpCreds =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (hasSmtpCreds) {
    console.log("Configuring Nodemailer with provided SMTP credentials...");
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true", // true for port 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    console.warn("SMTP credentials not fully configured in env. Creating Ethereal testing account...");
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
  return transporter;
}

async function sendMail({ to, subject, text, html }) {
  try {
    const client = await getTransporter();
    const info = await client.sendMail({
      from: process.env.SMTP_FROM || `"Aditya Kumar Portfolio" <noreply@aditya.dev>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully: %s", info.messageId);
    
    // For Ethereal, log a link to view the sent message
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("-----------------------------------------");
      console.log("Ethereal Mail Preview URL:", previewUrl);
      console.log("-----------------------------------------");
    }
    return info;
  } catch (err) {
    console.error("Failed to send email:", err);
    throw err;
  }
}

module.exports = { sendMail };
