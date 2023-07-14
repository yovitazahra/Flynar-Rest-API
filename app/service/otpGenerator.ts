const { Request, Response, NextFunction } = require('express')
const otpGenerator = require('otp-generator')

const generateOTP = (): number => {
  const OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  })
  return OTP
}

async function verifyOTP (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<typeof Response> {
  const { code } = req.query
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null
    req.app.locals.resetSession = true
    return res.status(201).json({
      status: 'SUCCESS',
      message: 'Verify Successfully'
    })
  }
  return res.status(400).send({ error: 'Invalid OTP' })
}

export {}

module.exports = {
  generateOTP,
  verifyOTP
}
