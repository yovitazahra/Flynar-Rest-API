const nodemailer = require("nodemailer");

const sendEmail = async (params: any) => {
  try {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: params.to, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
    console.log(params.to);
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export {};

module.exports = { sendEmail };
