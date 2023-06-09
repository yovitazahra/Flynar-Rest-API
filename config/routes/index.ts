const express = require('express')
const router = express.Router()
const { Request, Response, NextFunction } = require('express')

const {flightList, flightDetail} = require('../../app/controllers/flightController')
const {usersList} = require('../../app/controllers/userController')

router.get('/', (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
  res.status(200).json({
    status: 'SUCCESS',
    message: 'Welcome to Flynar Rest API'
  })
})

router.get('/api/v1/users', usersList)

// flights
router.get('/flights', flightList)
router.get('/flights/:id', flightDetail)


export { }

module.exports = router
