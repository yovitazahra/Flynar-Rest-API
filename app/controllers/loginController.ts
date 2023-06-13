const { Users } = require('../models/index')
const { Request, Response, NextFunction } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  usersList: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
    try {
      const result = await Users.findAll({
        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'phoneNumber']
      })
      return res.status(200).json({
        status: 'SUCCESS',
        users: result
      })
    } catch (err) {
      console.log(err)
    }
  },
  Login: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
    try {
      const user = await Users.findOne({
        where: {
          username: req.body.username,
          email: req.body.email
        }
      })

      const match = await bcrypt.compare(req.body.password, user.password)
      if (match === false) {
        return res.status(400).json({
          message: 'password salah!'
        })
      }

      const userId = user.id
      const username = user.username
      const email = user.email

      const accessToken = jwt.sign({
        userId,
        email,
        username
      }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '20s'
      })

      const refreshToken = jwt.sign({
        userId,
        email,
        username
      }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d'
      })

      await Users.update({
        refresh_token: refreshToken
      }, {
        where: {
          id: userId
        }
      })

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      })

      res.json({
        accessToken
      })
    } catch (error) {
      console.log(error)
      res.status(404).json({
        message: 'username atau email tidak ditemukan!'
      })
    }
  },
  Logout: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
    // const refreshToken = req.cookies.refreshToken
    // if(!refreshToken) return res.sendStatus(204)

    const user = await Users.findAll(
    //     {
    //     where:{
    //         refresh_token: refreshToken
    //     }
    // }
    )
    if (user[0] !== undefined) return res.sendStatus(204)

    await Users.update({
      refresh_token: null
    }, {
      where: {
        id: user[0].id
      }
    })

    res.clearCookie('refreshToken')
    return res.status(200).json({
      message: 'Anda sudah logout!'
    })
  }
}
