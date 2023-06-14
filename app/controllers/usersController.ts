const { Users } = require('../models/index')
const { Request, Response, NextFunction } = require('express')
const bcrypt = require('bcrypt')
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
  login,
  logout
}
