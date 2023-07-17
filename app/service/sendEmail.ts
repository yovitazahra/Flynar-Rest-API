const nodemailer = require('nodemailer')

const MAIL_SETTINGS = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'flynar.otp@gmail.com',
    pass: 'pawgjhwzmrsdfrjk'
  }
}

const sendOtpEmail = async (params: { to: string, OTP: number }): Promise<any> => {
  try {
    const transporter = nodemailer.createTransport(MAIL_SETTINGS)
    const info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: 'Flynar OTP Verification Code',
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Welcome to the Flynar.</h2>
          <h4>You are officially In ✔</h4>
          <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
      </div>
      `
    })
    return info
  } catch (error) {
    console.log(error)
    return false
  }
}

const sendResetPasswordEmail = async (params: { to: string, token: string }): Promise<any> => {
  try {
    const transporter = nodemailer.createTransport(MAIL_SETTINGS)
    const info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: 'Flynar Reset Password Link',
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Reset Password Flynar.</h2>
          <p>Follow this <a href="http://localhost:3000/reset-password?token=${params.token}">link</a> for continue reset your password</p>
      </div>
      `
    })
    return info
  } catch (error) {
    console.log(error)
    return false
  }
}

export {}

module.exports = { sendOtpEmail, sendResetPasswordEmail }
