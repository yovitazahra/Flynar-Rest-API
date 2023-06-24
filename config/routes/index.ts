const express = require('express')

const { Request, Response, NextFunction } = require('express')
const { forgotPassword } = require('../../app/controllers/usersController')

const router = express.Router()

router.get('/', (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
  res.status(200).json({
    status: 'SUCCESS',
    message: 'Welcome to Flynar Rest API'
  })
})

router.put('/api/v1/forgot-password', forgotPassword)

export {}

module.exports = router
