const express = require('express')
const { Request, Response, NextFunction } = require('express')
// const {usersList} = require('../../app/controllers/userController')
const {login} = require('../../app/controllers/loginController')

const router = express.Router()

router.get('/', (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
  res.status(200).json({
    status: 'SUCCESS',
    message: 'Welcome to Flynar Rest API'
  })
})

// router.get('/users', usersList)

router.post('/login', login)

export {}

module.exports = router
