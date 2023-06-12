const express = require('express')
const { Users } = require('../../app/models/index')
const { Request, Response, NextFunction } = require('express')
const {
  registerUsers,
  verifyEmail
} = require('../../app/controllers/usersController.ts')

const router = express.Router()

router.get('/api/v1/', (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
  res.status(200).json({
    status: 'SUCCESS',
    message: 'Welcome to Flynar Rest API'
  })
})

router.get('/users',
  async (
    req: typeof Request,
    res: typeof Response,
    next: typeof NextFunction
  ): Promise<any> => {
    try {
      const result = await Users.findAll()
      return res.status(200).json({
        status: 'SUCCESS',
        users: result
      })
    } catch (err) {
      console.log(err)
    }
  }
)

router.post('/api/v1/register', registerUsers)
router.post('/api/v1/verify', verifyEmail)

export {}

module.exports = router
