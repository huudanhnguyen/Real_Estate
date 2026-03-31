const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_NAME,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

/**
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: `"RealEstate" <${process.env.MAIL_NAME}>`,
    to,
    subject,
    html,
  });
}

module.exports = sendEmail;
