const { Flights, Tickets } = require('../models/index')
const { Request, Response, NextFunction } = require('express')

module.exports = {
  flightList: async (
    req: typeof Request,
    res: typeof Response,
    next: typeof NextFunction
  ): Promise<any> => {
    try {
      const result = await Flights.findAll({
        limit: 100,
        include: {
          model: Tickets,
          as: 'tickets',
          attributes: {
            exclude: ['id', 'createdAt', 'updatedAt']
          }
        }
      })
      const total = await Flights.count()
      return res.status(200).json({
        status: 'SUCCESS',
        total,
        flights: result
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'FAILED',
        message: 'Kesalahan Pada Server'
      })
    }
  },
  flightDetail: async (
    req: typeof Request,
    res: typeof Response,
    next: typeof NextFunction
  ): Promise<any> => {
    try {
      const result = await Flights.findOne({
        where: { id: req.params.id },
        include: {
          model: Tickets,
          as: 'tickets',
          attributes: {
            exclude: ['id', 'createdAt', 'updatedAt']
          }
        }
      })
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
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'FAILED',
        message: 'Kesalahan Pada Server'
      })
    }
  }
}

export { }
