const express = require('express')
const { Users, Flights } = require('../../app/models/index')
const { Request, Response, NextFunction } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.get('/', (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
  res.status(200).json({
    status: 'SUCCESS',
    message: 'Welcome to Flynar Rest API'
  })
})

// flights
router.get('/api/v1/users', async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
  try {
    const result = await Users.findAll()
    return res.status(200).json({
      status: 'SUCCESS',
      users: result
    })
  } catch (err) {
    console.log(err)
  }
})
router.get('/flights', async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
  try {
    const result = await Flights.findAll()
    return res.status(200).json({
      status: 'SUCCESS',
      users: result
    })
  } catch (err) {
    console.log(err)
  }
})
router.get('/flights/:id', async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {

  const result = await Flights.findOne({ where: { id: req.params.id } })
  if (result === null) {
    res.json({ status: 'ERROR', message: 'Data tidak ditemukan!' })
  }
  return res.status(200).json({
    status: 'SUCCESS',
    users: result
  })

})


export { }

module.exports = router
