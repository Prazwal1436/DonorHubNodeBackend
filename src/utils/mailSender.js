const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {

  console.log({email, title, body})
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      logger:true,
      debug:true,
      auth: {
        user:'verifydonorhub@gmail.com',
        pass: 'Padasoft@7342',
      }
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: 'verifydonorhub@gmail.com',
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = mailSender;