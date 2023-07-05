const jwt = require('jsonwebtoken')
const { Request, Response, NextFunction } = require('express')

const verifyToken = (
  req: typeof Request,
  res: typeof Response,
  next: typeof NextFunction
): any | typeof Response => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (token === null || token === undefined) {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Token Invalid'
    })
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: Error, decoded: any) => {
      if (err !== null) {
        return res.status(401).json({
          status: 'FAILED',
          message: 'Silahkan Login'
        })
      }
      req.email = decoded.email
      req.id = decoded.id
      next()
    }
  )
}

export {}

module.exports = verifyToken
