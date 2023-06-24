const { Users } = require('../models/index')
const { Request, Response, NextFunction } = require('express')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
        res.status(404).json({
          status: 'FAILED',
          message: 'Password dan Konfirmasi Password Berbeda'
        })
      }

      jwt.verify(token, process.env.RESET_PASSWORD_SECRET, async (err: Error, decoded: any) => {
        if (err === null) {
          const hashPassword = await bcryptjs.hash(password, 10)
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
      })
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
  resetPassword
}
