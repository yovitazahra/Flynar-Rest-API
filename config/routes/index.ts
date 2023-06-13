const express = require('express')
const { Request, Response, NextFunction } = require('express')
const {Login,Logout,usersList} = require('../../app/controllers/loginController')
const {verifyToken} = require('../../app/middleware/verifyToken')

const router = express.Router()

router.get('/', (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
  res.status(200).json({
    status: 'SUCCESS',
    message: 'Welcome to Flynar Rest API'
  })
})

router.get('/api/v1/users', verifyToken,usersList)
router.post('/api/v1/login', Login)
router.delete('/api/v1/logout', Logout)

export {}

module.exports = router
