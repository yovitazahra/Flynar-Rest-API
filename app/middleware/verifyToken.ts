const jwt = require('jsonwebtoken')
const { Request, Response, NextFunction } = require('express')

const verifyToken = (
  req: typeof Request,
  res: typeof Response,
  next: typeof NextFunction
): any | typeof Response => {
  const refreshToken = req?.cookies?.refreshToken
  if (refreshToken === undefined) {
    return res.status(401).json({
      status: 'FAILED',
      message: 'Silahkan Login'
    })
  }

  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (token === null || token === undefined) {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Token Invalid'
    })
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error: Error, decoded: any) => {
    if (error !== null) {
      res.cookie('refreshToken', '')
      return res.status(401).json({
        status: 'FAILED',
        message: 'Sesi Login Expired, Silahkan Login Ulang'
      })
    }
    req.email = decoded.email
    req.id = decoded.id
    next()
  })
}

export {}

module.exports = verifyToken
