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
    let { departureAirport, arrivalAirport,classSeat } = req.query

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

      if(data.length === 0) {
        return res.status(404).json({message:'Maaf pencarian anda tidak ditemukan'})
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
  filterFlightTickets:async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
    try {
      
      const sortBy = req.query.sortBy

      const data = await Tickets.findAll({
        limit: 100,
        include: "Flight"
      })

        const nestedSortFunction = (a:any,b:any) =>{
          // harga
        if(sortBy === 'price'){
          return a.price - b.price
          // keberangkatan awal
        }else if(sortBy === '$Flight.departureDate'){
          return a.departureDate - b.departureDate
          // keberangkatan akhir
        }else if(sortBy === '$Flight.departureDate'){
          return b.departureDate - a.departureDate
          // kedatangan awal
        }else if(sortBy === '$Flight.arrivalDate'){
          return a.arrivalDate - b.arrivalDate
          // kedatangan akhir
        }else if(sortBy === '$Flight.arrivalDate'){
          return b.arrivalDate - a.arrivalDate
        }
      }

      const sortedData = data.sort(nestedSortFunction)

      return res.status(200).json({
        message: 'SUCCESS',
        sortedData
      })

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Kesalahan pada server' });
    }
  }
}

export { }
