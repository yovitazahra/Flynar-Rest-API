const { Request, Response, NextFunction } = require('express')

async function localVariable (
  req: typeof Request,
  res: typeof Response,
  next: typeof NextFunction
): Promise<void> {
  req.app.locals = {
    OTP: null,
    resetSession: false
  }
  next()
}

module.exports = {
  localVariable
}
