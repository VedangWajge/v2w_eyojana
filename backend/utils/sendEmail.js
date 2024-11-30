const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Helps with Gmail's security checks
    },
  });

  // Create email options (use either HTML or text, not both in this case)
  const mailOptions = {
    from: sent_from,
    to: send_to,           // Recipient's email
    replyTo: reply_to,      // Reply-to email
    subject: subject,       // Email subject
    html: message,          // HTML content (for rich text emails)
  };

  // Send Email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return { success: true };
  } catch (error) {
    console.error('Error while sending email:', error);
    return { success: false, error }; // Return error to handle in the route
  }
};

module.exports = sendEmail;
