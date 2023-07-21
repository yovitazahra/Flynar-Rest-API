const { Request, Response, NextFunction } = require('express')
const bcrypt = require('bcrypt')
const { Users } = require('../models/index')
const { sendResetPasswordEmail, sendOtpEmail } = require('../service/sendEmail')
const { generateOTP } = require('../service/otpGenerator')
const emailValidator = require('deep-email-validator')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { userTransformer } = require('../utils/userTransformer')

async function usersList (
  req: typeof Request,
  res: typeof Response
): Promise<any> {
  try {
    const result = await Users.findAll({
      attributes: ['name', 'email', 'phoneNumber', 'isVerified'],
      limit: 100
    })
    return res.status(200).json({
      status: 'SUCCESS',
      users: result
    })
  } catch (error) {
    console.log(error)
  }
}

async function getUserById (
  req: typeof Request,
  res: typeof Response
): Promise<any> {
  const refreshToken = req?.cookies?.refreshToken
  try {
    const userRecord = await Users.findOne({
      where: {
        refreshToken
      }
    })
    if (userRecord === null) {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Akun Tidak Ditemukan'
      })
    }
    return res.status(200).json({
      status: 'SUCCESS',
      data: userTransformer(userRecord)
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        status: 'FAILED',
        message: error.message
      })
    }
  }
}

async function registerUsers (
  req: typeof Request,
  res: typeof Response
): Promise<typeof Response> {
  const { name, email, password, phoneNumber } = req.body
  if (name === '' || email === '' || password === '' || phoneNumber === '') {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Mohon Lengkapi Data'
    })
  }

  const isExisting = await findUserByEmail(email)
  if (isExisting !== null) {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Email Sudah Terdaftar'
    })
  }

  const { valid, reason, validators } = await isEmailValid(email)
  if (valid === false) {
    return res.status(400).send({
      status: 'FAILED',
      message: 'Email Tidak Ditemukan',
      reason: validators[reason].reason
    })
  }

  const newUser = await createUser(name, email, password, phoneNumber)

  if (newUser !== false) {
    res.status(201).json({
      status: 'SUCCESS',
      message: 'Silahkan Lanjut Verifikasi',
      user: newUser
    })
  } else {
    res.status(400).json({
      status: 'FAILED',
      message: 'Terjadi Kesalahan Pada Proses Registrasi'
    })
  }
}

async function resendOtp (
  req: typeof Request,
  res: typeof Response
): Promise<typeof Response> {
  const { email } = req.body
  if (email === '') {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Mohon Lengkapi E-mail'
    })
  }

  const isExisting: any = await findUserByEmail(email)

  if (isExisting === null) {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Email Tidak Ditemukan, Silahkan Daftar'
    })
  }

  if (isExisting.isVerified === true) {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Email Sudah Diverifikasi'
    })
  }

  const otpGenerated = generateOTP()
  try {
    const emailSended = await sendOtpEmail({
      to: email,
      OTP: otpGenerated
    })

    if (emailSended !== false) {
      Users.update(
        { otp: otpGenerated },
        {
          where: {
            id: isExisting.id
          }
        }
      )
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
  } catch (error: any) {
    return error
  }
}

async function findUserByEmail (
  email: string
): Promise<boolean | Record<string, any>> {
  const user = await Users.findOne({
    where: { email }
  })
  return user
}

async function createUser (
  name: string,
  email: string,
  password: string,
  phoneNumber: string
): Promise<Record<string, any> | Error | boolean> {
  const hashPassword = bcrypt.hashSync(password, 10)
  const otpGenerated = generateOTP()

  try {
    const emailSended = await sendOtpEmail({
      to: email,
      OTP: otpGenerated
    })

    if (emailSended !== false) {
      const newUser = await Users.create({
        name,
        email,
        password: hashPassword,
        phoneNumber,
        otp: otpGenerated,
        isVerified: false
      })

      const returnValue = {
        name: newUser.name,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber
      }
      return returnValue
    } else {
      return false
    }
  } catch (error: any) {
    return error
  }
}

async function verifyEmail (
  req: typeof Request,
  res: typeof Response
): Promise<typeof Response> {
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

async function validateRegisterUser (
  email: string,
  otp: number
): Promise<typeof Response> {
  const user = await Users.findOne({
    where: { email }
  })
  if (user === null) {
    return [404, 'Akun Tidak Ditemukan']
  }
  if (user.isVerified === true) {
    return [400, 'Email Sudah Diverifikasi']
  }
  if (user !== null && user.otp !== otp) {
    return [401, 'OTP Invalid atau Tidak Cocok']
  }
  await Users.update({ isVerified: true }, { where: { email } })
  return [200, 'Verifikasi Berhasil']
}

async function isEmailValid (email: string): Promise<Record<string, any>> {
  return emailValidator.validate(email)
}

async function login (
  req: typeof Request,
  res: typeof Response,
  next: typeof NextFunction
): Promise<any> {
  const { identifier, password } = req.body
  let refreshToken = req?.cookies?.refreshToken

  try {
    if (refreshToken !== '' && refreshToken !== undefined) {
      const user = await Users.findAll({
        where: { refreshToken }
      })

      if (user[0] === undefined) {
        res.cookie('refreshToken', '')
        return res.status(401).json({
          status: 'FAILED',
          message: 'Sesi Login Expired, Silahkan Login Ulang'
        })
      }

      const authHeader = req.headers.authorization
      const token = authHeader?.split(' ')[1]

      if (token !== null || token !== undefined) {
        jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET,
          (error: Error, decoded: any) => {
            if (error !== null) {
              jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (error: Error) => {
                  if (error instanceof Error) {
                    res.cookie('refreshToken', '')
                    return res.status(401).json({
                      status: 'FAILED',
                      message: 'Sesi Login Expired, Silahkan Login Ulang'
                    })
                  }

                  const { id, email } = user
                  const accessToken = jwt.sign(
                    { id, email },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                      expiresIn: '1d'
                    }
                  )
                  res.status(200).json({
                    status: 'SUCCESS',
                    accessToken
                  })
                }
              )
            } else {
              res.status(200).json({
                status: 'SUCCESS',
                message: 'Anda Sudah Login',
                accessToken: token
              })
            }
          }
        )
      }
    } else if (
      identifier === undefined ||
      identifier === '' ||
      password === undefined ||
      password === ''
    ) {
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
        if (user.isVerified === false) {
          return res.status(401).json({
            status: 'FAILED',
            message: 'Silahkan Verifikasi Akun Ini'
          })
        }
        const match = await bcrypt.compare(password, user.password)
        if (match === false) {
          return res.status(400).json({
            status: 'FAILED',
            message: 'Password Salah'
          })
        } else {
          const { email } = user
          const userId = user.id
          const accessToken = jwt.sign(
            { id: userId, email },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: '1d'
            }
          )
          refreshToken = jwt.sign(
            { id: userId, email },
            process.env.REFRESH_TOKEN_SECRET,
            {
              expiresIn: '30 days'
            }
          )
          await Users.update(
            { refreshToken },
            {
              where: {
                id: userId
              }
            }
          )
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
          })
          res.status(200).json({
            status: 'SUCCESS',
            accessToken
          })
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

async function logout (
  req: typeof Request,
  res: typeof Response,
  next: typeof NextFunction
): Promise<any> {
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

    if (user[0] !== undefined) {
      await Users.update(
        { refreshToken: null },
        {
          where: { id: user[0].id }
        }
      )
    }

    res.clearCookie('refreshToken')
    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Logout Berhasil'
    })
  } catch (error) {
    console.log(error)
  }
}

async function refreshAccessToken (
  req: typeof Request,
  res: typeof Response,
  next: typeof NextFunction
): Promise<any> {
  try {
    const refreshToken = req?.cookies?.refreshToken
    if (refreshToken === undefined) {
      return res.status(401).json({
        status: 'FAILED',
        message: 'Silahkan Login'
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

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error: Error) => {
      if (error instanceof Error) {
        res.cookie('refreshToken', '')
        return res.status(401).json({
          status: 'FAILED',
          message: 'Sesi Login Expired, Silahkan Login Ulang'
        })
      }

      const { id, email } = user[0]
      const accessToken = jwt.sign(
        { id, email },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '1d'
        }
      )
      res.status(200).json({
        status: 'SUCCESS',
        accessToken
      })
    })
  } catch (error) {
    console.log(error)
  }
}

async function updateUser (
  req: typeof Request,
  res: typeof Response,
  next: typeof NextFunction
): Promise<any> {
  try {
    const { name = '', phoneNumber = '' } = req.body
    const refreshToken = req?.cookies?.refreshToken
    if (name === '' || phoneNumber === '') {
      return res.status(400).json({
        status: 'SUCCESS',
        message: 'Lengkapi Data'
      })
    }

    if (isNaN(parseInt(phoneNumber))) {
      return res.status(400).json({
        status: 'SUCCESS',
        message: 'Nomor Telepon Wajib Angka'
      })
    }
    const data = await Users.update(
      {
        name,
        phoneNumber
      },
      {
        where: { refreshToken }
      }
    )
    if (data === null) {
      return res.status(400).json({
        status: 'SUCCESS',
        message: 'Profil Gagal Diperbarui'
      })
    }
    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Profil Berhasil Diperbarui'
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        status: 'FAILED',
        message: error.message
      })
    }
  }
}

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

      const token = jwt.sign(
        { id: user._id, email },
        process.env.RESET_PASSWORD_SECRET,
        { expiresIn: '3m' }
      )
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

async function resetPassword (
  req: typeof Request,
  res: typeof Response,
  next: typeof NextFunction
): Promise<any> {
  const { token, password, confirmation } = req.body

  try {
    const user = await Users.findOne({
      where: {
        resetPasswordToken: token
      }
    })

    if (user !== null) {
      if (password !== confirmation) {
        res.status(400).json({
          status: 'FAILED',
          message: 'Password dan Konfirmasi Password Berbeda'
        })
      }

      jwt.verify(
        token,
        process.env.RESET_PASSWORD_SECRET,
        async (error: Error, decoded: any) => {
          if (error === null) {
            const hashPassword = await bcrypt.hash(password, 10)
            user.password = hashPassword
            user.resetPasswordToken = ''
            await user.save()
            res.status(201).json({
              status: 'SUCCESS',
              message: 'Password Berhasil Diubah'
            })
          } else {
            res.status(402).json({
              status: 'FAILED',
              message: 'Token Kadaluwarsa atau Invalid'
            })
          }
        }
      )
    } else {
      res.status(404).json({
        status: 'FAILED',
        message: 'Akun Tidak Ditemukan atau Token Sudah Digunakan'
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export {}

module.exports = {
  usersList,
  getUserById,
  registerUsers,
  resendOtp,
  verifyEmail,
  login,
  logout,
  refreshAccessToken,
  updateUser,
  forgotPassword,
  resetPassword
}
