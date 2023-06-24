const { Tickets, Flights } = require('../models/index')
const { Request, Response, NextFunction } = require('express')

module.exports = {
  ticketList: async (
    req: typeof Request,
    res: typeof Response,
    next: typeof NextFunction
  ): Promise<any> => {
    try {
      const result = await Tickets.findAll({
        limit: 100,
        include: {
          model: Flights,
          as: 'flight'
        }
      })
      const total = await Tickets.count()
      return res.status(200).json({
        status: 'SUCCESS',
        total,
        tickets: result
      })
    } catch (err) {
      console.log(err)
    }
  },
  ticketDetail: async (
    req: typeof Request,
    res: typeof Response,
    next: typeof NextFunction
  ): Promise<any> => {
    try {
      const result = await Tickets.findOne({
        where: { id: req.params.id },
        include: {
          model: Flights,
          as: 'flight'
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
        ticket: result
      })
    } catch (err) {
      console.log(err)
    }
  }
}

export {}
