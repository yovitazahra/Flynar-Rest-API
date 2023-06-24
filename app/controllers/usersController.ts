const { Users } = require('../../app/models/index')
const { Request, Response, NextFunction } = require('express')
const { sendResetPasswordEmail } = require('../service/sendEmail')
const jwt = require('jsonwebtoken')

async function forgotPassword (
  req: typeof Request,
  res: typeof Response,
  next: typeof NextFunction
): Promise<any> {
  const { email } = req.body

  try {
    const user = await Users.findOne({ where: { email } })

    if (user !== null) {
      if (user.isVerified === false) {
        return res.status(401).json({
          status: 'FAILED',
          message: 'Silahkan Verifikasi Akun Ini'
        })
      }

      const token = jwt.sign({ id: user._id }, process.env.RESET_PASSWORD_SECRET, { expiresIn: '5m' })
      const emailSended = await sendResetPasswordEmail({
        to: email,
        token
      })

      if (emailSended !== false) {
        await user.update({ resetPasswordToken: token })
        res.status(201).json({
          status: 'SUCCESS',
          message: 'Silahkan Periksa Email Anda'
        })
      } else {
        res.status(400).json({
          status: 'FAILED',
          message: 'Terjadi Kesalahan'
        })
      }
    } else {
      res.status(404).json({
        status: 'FAILED',
        message: 'Akun Belum Terdaftar'
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export {}

module.exports = {
  forgotPassword
}
