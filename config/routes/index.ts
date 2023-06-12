const express = require('express')
const router = express.Router()
const { Request, Response, NextFunction } = require('express')

const { flightList, flightDetail } = require('../../app/controllers/flightsController')
const { usersList } = require('../../app/controllers/usersController')

router.get('/api/v1/', (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
  res.status(200).json({
    status: 'SUCCESS',
    message: 'Welcome to Flynar Rest API'
  })
})

router.get('/api/v1/users', usersList)

// flights
router.get('/api/v1/flights', flightList)
router.get('/api/v1/flights/:id', flightDetail)

export { }

module.exports = router
