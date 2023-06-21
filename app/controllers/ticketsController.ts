const { Tickets, Flights } = require('../models/index')
const { Request, Response, NextFunction } = require('express')
const { Op } = require('sequelize')

module.exports = {
  ticketList: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
    try {
      const result = await Tickets.findAll({
        include: Flights,
        limit: 100
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
  ticketDetail: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
    try {
      const result = await Tickets.findOne({ where: { id: req.params.id } })
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
  },

  searchFlightTickets: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
    let { departureAirport, arrivalAirport, classSeat } = req.query

    try {
      const data = await Tickets.findAll({
        limit: 100,
        include: "Flight",
        where: {
          '$Flight.departureAirport$': { [Op.iLike]: `%${departureAirport}` },
          '$Flight.arrivalAirport$': { [Op.iLike]: `%${arrivalAirport}` },
          classSeat: { [Op.iLike]: `${classSeat}%` }
        }
      })

      const count = await Tickets.count({
        limit: 100,
        include: "Flight",
        where: {
          '$Flight.departureAirport$': { [Op.iLike]: `%${departureAirport}` },
          '$Flight.arrivalAirport$': { [Op.iLike]: `%${arrivalAirport}` },
          classSeat: { [Op.iLike]: `${classSeat}%` }
        }
      })

      if (data.length === 0) {
        return res.status(404).json({ message: 'Maaf pencarian anda tidak ditemukan' })
      }

      return res.status(200).json({
        message: 'SUCCESS',
        count,
        data
      })

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Kesalahan pada server' });
    }
  },
  filterFlightTickets: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
    try {

      const sortBy = req.query.sortBy
      let sortedData

      // harga termurah
      if (sortBy === 'price') {
        sortedData = await Tickets.findAll({
          limit: 100,
          order: [['price', 'ASC']],
        });
      } 
      // durasi terpendek
      else if (sortBy === 'duration') {
        sortedData = await Tickets.findAll({
          limit: 100,
          include: [{ model: Flights }],
          order: [[{ model: Flights }, 'duration', 'ASC']],
        })
      } 
      // keberangkatan paling awal
      else if(sortBy === 'departureDateStart'){
        sortedData = await Tickets.findAll({
          limit: 100,
          include: [{ model: Flights }],
          order: [[{ model: Flights }, 'departureDate', 'ASC']],
        })
      }
      // keberangkatan paling akhir
      else if(sortBy === 'departureDateEnd'){
        sortedData = await Tickets.findAll({
          limit: 100,
          include: [{ model: Flights }],
          order: [[{ model: Flights }, 'departureDate', 'DESC']],
        })
      }
      // kedatangan paling awal
      else if(sortBy === 'arrivalDateStart'){
        sortedData = await Tickets.findAll({
          limit: 100,
          include: [{ model: Flights }],
          order: [[{ model: Flights }, 'arrivalDate', 'ASC']],
        })
      }
      // kedatangan paling akhir
       else if(sortBy === 'arrivalDateEnd'){
        sortedData = await Tickets.findAll({
          limit: 100,
          include: [{ model: Flights }],
          order: [[{ model: Flights }, 'arrivalDate', 'DESC']],
        })
      }
      else {
        sortedData = await Tickets.findAll({
          include: [{ model: Flights }],
        })
      }

      return res.status(200).json({
        message: 'SUCCESS',
        sortedData
      })

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Kesalahan pada server' })
    }
  }
}

export { }
