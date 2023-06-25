const { Tickets, Flights } = require('../models/index')
const { Request, Response, NextFunction } = require('express')
const { Op } = require('sequelize')

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
      return res.status(500).json({
        status: 'FAILED',
        message: 'Kesalahan Pada Server'
      })
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
      return res.status(500).json({
        status: 'FAILED',
        message: 'Kesalahan Pada Server'
      })
    }
  },
  searchFlightTickets: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
    const { departureAirport, arrivalAirport, classSeat }: Record<string, string> = req.query
    console.log(departureAirport, arrivalAirport, classSeat)
    try {
      const data = await Tickets.findAll({
        limit: 100,
        include: {
          model: Flights,
          as: 'flight'
        },
        where: {
          '$flight.departureAirport$': { [Op.iLike]: `%${departureAirport}` },
          '$flight.arrivalAirport$': { [Op.iLike]: `%${arrivalAirport}` },
          classSeat: { [Op.iLike]: `${classSeat}%` }
        }
      })

      const count = await Tickets.count({
        limit: 100,
        include: {
          model: Flights,
          as: 'flight'
        },
        where: {
          '$flight.departureAirport$': { [Op.iLike]: `%${departureAirport}` },
          '$flight.arrivalAirport$': { [Op.iLike]: `%${arrivalAirport}` },
          classSeat: { [Op.iLike]: `${classSeat}%` }
        }
      })

      if (data.length === 0) {
        return res.status(404).json({ message: 'Maaf pencarian anda tidak ditemukan' })
      }

      return res.status(200).json({
        status: 'SUCCESS',
        count,
        data
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'FAILED',
        message: 'Kesalahan Pada Server'
      })
    }
  },
  filterFlightTickets: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
    try {
      const sortBy = req.query.sortBy
      let sortedData

      if (sortBy === 'price') { // harga termurah
        sortedData = await Tickets.findAll({
          limit: 100,
          order: [['price', 'ASC']]
        })
      } else if (sortBy === 'duration') { // durasi terpendek
        sortedData = await Tickets.findAll({
          limit: 100,
          include: [{ model: Flights }],
          order: [[{ model: Flights }, 'duration', 'ASC']]
        })
      } else if (sortBy === 'departureDateStart') { // keberangkatan paling awal
        sortedData = await Tickets.findAll({
          limit: 100,
          include: [{ model: Flights }],
          order: [[{ model: Flights }, 'departureDate', 'ASC']]
        })
      } else if (sortBy === 'departureDateEnd') { // keberangkatan paling akhir
        sortedData = await Tickets.findAll({
          limit: 100,
          include: [{ model: Flights }],
          order: [[{ model: Flights }, 'departureDate', 'DESC']]
        })
      } else if (sortBy === 'arrivalDateStart') { // kedatangan paling awal
        sortedData = await Tickets.findAll({
          limit: 100,
          include: [{ model: Flights }],
          order: [[{ model: Flights }, 'arrivalDate', 'ASC']]
        })
      } else if (sortBy === 'arrivalDateEnd') { // kedatangan paling akhir
        sortedData = await Tickets.findAll({
          limit: 100,
          include: [{ model: Flights }],
          order: [[{ model: Flights }, 'arrivalDate', 'DESC']]
        })
      } else {
        sortedData = await Tickets.findAll({
          include: [{ model: Flights }]
        })
      }

      return res.status(200).json({
        status: 'SUCCESS',
        data: sortedData
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
