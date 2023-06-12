const { Flights } = require('../models/index')
const { Request, Response, NextFunction } = require('express')

module.exports = {
  flightList: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
    try {
      const result = await Flights.findAll()
      const total = await Flights.count()
      return res.status(200).json({
        status: 'SUCCESS',
        total,
        flights: result
      })
    } catch (err) {
      console.log(err)
    }
  },
  flightDetail: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
    try {
      const result = await Flights.findOne({ where: { id: req.params.id } })
      if (result === null) {
        return res.status(404).json({
          status: 'FAILED',
          message: 'Data tidak ditemukan'
        })
      }
      return res.status(200).json({
        status: 'SUCCESS',
        flight: result
      })
    } catch (err) {
      console.log(err)
    }
  }
}
