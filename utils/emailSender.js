const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dummyprogramtest@gmail.com",
    pass: process.env.PASS,
  },
});

const mailOptions = (to, subject, html) => ({
  from: "'Blogga' <dummyprogramtest@gmail.com>",
  to,
  subject,
  html,
});

const sendEmail = (to, subject, html) => {
  const mail = mailOptions(to, subject, html);

   transporter.sendMail(mail, (error, info) => {
    if (error) {
      console.log("Error occurred: " + error.message);
    } else {
      console.log("Email sent successfully!");
      console.log("Message ID: " + info.messageId);
    }
  });
};

const sendEmailVerification = (user) => {
  const htmlTemplate = 
  `<h2>Welcome to Blogga🎊</h2>
  <hr>
  <h3>Hello, ${user.name}👋</h3>
  <p>We're happy to say welcome onboard</p>
  <p>Please, click the following link to verify your email: <a href="http://localhost:3000/api/v1/user/verify/${user.emailVerificationToken}">Verify Email</a></p>`;
  sendEmail(user.email, "Email Verification", htmlTemplate);
};

const sendPasswordResetEmail = (user) => {
  const htmlTemplate = `
  <h3>Hello, ${user.name}👋</h3>
  <p>Click the following link to reset your password: <a href="http://localhost:3000/api/v1/user/password-reset-done/${user.passwordChangeToken}">Reset Password</a></p>
  <p>If you didn't initiate this, kindly ignore it.</p>
  `;
  sendEmail(user.email, "Password Reset", htmlTemplate);
};

const sendPasswordChangeEmail = (user) => {
    const htmlTemplate = `
  <h3>Hello, ${user.name}👋</h3>
  <p>Your password reset was successful</p>
  `;
    sendEmail(user.email, "Password Reset Successful", htmlTemplate);  
}

module.exports = { sendEmailVerification, sendPasswordResetEmail, sendPasswordChangeEmail };