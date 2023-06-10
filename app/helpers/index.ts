const nodemailer = require('nodemailer');

exports.kirimEmail = (dataEmail:string) =>{
    let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    requireTLS:true,
    auth: {
      user: 'gilangmaulana541@gmail.com', 
      pass: 'croziajdmkjxpgai', 
    }
  });

  return (
      transporter.sendMail(dataEmail)
      .then((info:any) => console.log(`email terkirim ${info.message}`))
      .catch((err:Error) => console.log(`terjadi kesalahan ${err.message}`))
  )
}