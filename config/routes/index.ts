const express = require('express')

const { Request, Response, NextFunction } = require('express')
const {getAllUsers,forgotPassword,resetPassword} = require('../../app/controllers/userController')

const router = express.Router()

router.get('/', (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
  res.status(200).json({
    status: 'SUCCESS',
    message: 'Welcome to Flynar Rest API'
  })
})

router.get('/api/v1/users', getAllUsers)
router.put('/api/v1/forgot-password', forgotPassword)
router.put('/api/v1/reset-password', resetPassword)

export {}

module.exports = router
