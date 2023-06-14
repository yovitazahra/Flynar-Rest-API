const { Request, Response, NextFunction } = require('express')
const bcrypt = require('bcrypt')
const { Users } = require('../models/index')
const { sendEmail } = require('../service/sendEmail')
const { generateOTP } = require('../service/otpGenerator')
const emailValidator = require('deep-email-validator')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

async function usersList (req: typeof Request, res: typeof Response): Promise<any> {
  try {
    const result = await Users.findAll({
      attributes: ['username', 'email', 'firstName', 'lastName', 'phoneNumber'],
      limit: 100
    })
    return res.status(200).json({
      status: 'SUCCESS',
      users: result
    })
  } catch (err) {
    console.log(err)
  }
}

async function registerUsers (req: typeof Request, res: typeof Response): Promise<typeof Response> {
  const { username, email, password, firstName, lastName, phoneNumber } = req.body
  if (
    username === '' ||
    email === '' ||
    password === '' ||
    firstName === '' ||
    lastName === '' ||
    phoneNumber === ''
  ) {
    return res.status(400).json({
      status: 'FAILED',
      msg: 'Mohon Lengkapi Data'
    })
  }

  const { valid, reason, validators } = await isEmailValid(email)
  if (valid === false) {
    return res.status(400).send({
      status: 'FAILED',
      message: 'Masukkan Alamat Email Yang Valid',
      reason: validators[reason].reason
    })
  }

  const isExisting = await findUserByEmail(email)
  if (isExisting !== null) {
    return res.status(400).json({
      status: 'FAILED',
      msg: 'Email Sudah Terdaftar'
    })
  }

  const newUser = await createUser(
    username,
    email,
    password,
    firstName,
    lastName,
    phoneNumber
  )

  if (newUser !== false) {
    res.status(201).json({
      status: 'SUCCESS',
      user: newUser
    })
  } else {
    res.status(400).json({
      status: 'FAILED',
      message: 'Terjadi Kesalahan Pada Proses Registrasi'
    })
  }
}

async function findUserByEmail (email: string): Promise<boolean | Record<string, any>> {
  const user = await Users.findOne({
    where: { email }
  })
  return user
}

async function createUser (
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string
): Promise<Record<string, any> | Error | boolean> {
  const hashPassword = bcrypt.hashSync(password, 10)
  const otpGenerated = generateOTP()

  try {
    const emailSended = await sendEmail({
      to: email,
      OTP: otpGenerated
    })

    if (emailSended !== false) {
      const newUser = await Users.create({
        username,
        email,
        password: hashPassword,
        firstName,
        lastName,
        phoneNumber,
        otp: otpGenerated,
        isVerified: false
      })

      const returnValue = { username: newUser.username, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName, phoneNumber: newUser.phoneNumber }
      return returnValue
    } else {
      return false
    }
  } catch (error: any) {
    return error
  }
}

async function verifyEmail (req: typeof Request, res: typeof Response): Promise<typeof Response> {
  const { email, otp } = req.body
  const user = await validateRegisterUser(email, otp)
  if (user[0] !== 200) {
    return res.status(user[0]).json({
      status: 'FAILED',
      message: user[1]
    })
  }
  return res.status(user[0]).json({
    status: 'SUCCESS',
    message: user[1]
  })
}

async function validateRegisterUser (email: string, otp: number): Promise<typeof Response> {
  const user = await Users.findOne({
    where: { email }
  })
  if (user === null) {
    return [404, 'Akun Tidak Ditemukan']
  }
  if (user !== null && user.otp !== otp) {
    return [401, 'Invalid OTP']
  }
  await Users.update({ isVerified: true },
    { where: { email } })
  return [200, 'Verifikasi Berhasil']
}

async function isEmailValid (email: string): Promise<Record<string, any>> {
  return emailValidator.validate(email)
}

async function login (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> {
  const { identifier, password } = req.body
  let refreshToken = req?.cookies?.refreshToken

  try {
    if (refreshToken !== undefined) {
      res.status(400).json({
        status: 'FAILED',
        message: 'Anda Sudah Login'
      })
    } else if (identifier === undefined || identifier === '' || password === undefined || password === '') {
      res.status(400).json({
        status: 'FAILED',
        message: 'Lengkapi Email/Nomor Telepon dan Password'
      })
    } else {
      const user = await Users.findOne({
        where: {
          [Op.or]: [
            { email: { [Op.like]: identifier } },
            { phoneNumber: { [Op.like]: identifier } }
          ]
        }
      })
      if (user !== null) {
        const match = await bcrypt.compare(password, user.password)
        if (match === false) {
          return res.status(400).json({
            status: 'FAILED',
            message: 'Password Salah'
          })
        } else {
          const { username, email } = user
          const userId = user.id
          const accessToken = jwt.sign({ userId, email, username }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '6h'
          })
          refreshToken = jwt.sign({ userId, email, username }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
          })
          await Users.update({ refreshToken }, {
            where: {
              id: userId
            }
          })
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
          })
          res.json({ accessToken })
        }
      } else {
        res.status(404).json({
          status: 'FAILED',
          message: 'Akun Belum Terdaftar'
        })
      }
    }
  } catch (error) {
    console.log(error)
  }
}

async function logout (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> {
  try {
    const refreshToken = req?.cookies?.refreshToken
    if (refreshToken === undefined) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'Tidak Ada Aktivitas Login'
      })
    }
    const user = await Users.findAll({
      where: { refreshToken }
    })

    if (user[0] === undefined) {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Akun Tidak Ditemukan'
      })
    }

    await Users.update({ refreshToken: null }, {
      where: { id: user[0].id }
    })

    res.clearCookie('refreshToken')
    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Logout Berhasil'
    })
  } catch (error) {
    console.log(error)
  }
}

export {}

module.exports = {
  usersList,
  registerUsers,
  verifyEmail,
  login,
  logout
}
