const express = require('express')
const router = express.Router()
const { Request, Response, NextFunction } = require('express')
const {
  flightList,
  flightDetail
} = require('../../app/controllers/flightsController')
const {
  ticketList,
  ticketDetail,
  searchFlightTickets,
  filterFlightTickets
} = require('../../app/controllers/ticketsController')
const {
  registerUsers,
  verifyEmail,
  usersList,
  login,
  logout,
  getUserById,
  refreshAccessToken,
  resendOtp,
  updateUser,
  forgotPassword,
  resetPassword
} = require('../../app/controllers/usersController')
const verifyToken = require('../../app/middleware/verifyToken')

router.get(
  '/api/v1/',
  (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Welcome to Flynar Rest API'
    })
  }
)

router.get('/api/v1/users', usersList)
router.get('/api/v1/profile', verifyToken, getUserById)
router.get('/api/v1/token', refreshAccessToken)
router.post('/api/v1/register', registerUsers)
router.post('/api/v1/resend-otp', resendOtp)
router.post('/api/v1/verify', verifyEmail)
router.post('/api/v1/login', login)
router.put('/api/v1/profile/update', verifyToken, updateUser)
router.put('/api/v1/forgot-password', forgotPassword)
router.put('/api/v1/reset-password', resetPassword)
router.delete('/api/v1/logout', logout)

// flights
router.get('/api/v1/flights', flightList)
router.get('/api/v1/flights/:id', flightDetail)
router.get('/api/v1/search', searchFlightTickets)
router.get('/api/v1/filter', filterFlightTickets)

// tickets
router.get('/api/v1/tickets', ticketList)
router.get('/api/v1/tickets/:id', ticketDetail)

export {}

module.exports = router
