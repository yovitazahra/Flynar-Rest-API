const jwt = require('jsonwebtoken')
const { Request, Response, NextFunction } = require('express')

const verifyToken = (req: typeof Request, res: typeof Response, next: typeof NextFunction): any | typeof Response => {
  const refreshToken = req?.cookies?.refreshToken
  if (refreshToken === undefined) {
    return res.status(401).json({
      status: 'FAILED',
      message: 'Silahkan Login'
    })
  }

  const authHeader = req.headers.authorization
  const token = (Boolean(authHeader)) && authHeader.split(' ')[1]

  if (token === null || token === undefined) {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Token Invalid'
    })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: Error, decoded: any) => {
    console.log(err)
    if (err !== null) {
      return res.status(401).json({
        status: 'FAILED',
        message: 'Sesi Login Expired, Silahkan Login'
      })
    }
    req.email = decoded.email
    next()
  })
}

export {}

module.exports = verifyToken
