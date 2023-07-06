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
          as: 'flight',
          attributes: {
            exclude: ['id', 'createdAt', 'updatedAt']
          }
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
          as: 'flight',
          attributes: {
            exclude: ['id', 'createdAt', 'updatedAt']
          }
        }
      })
      if (result === null) {
        return res.status(404).json({
          status: 'FAILED',
          message: 'Data Tidak Ditemukan'
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
    const { departureCity = '', arrivalCity = '', classSeat = '', total = '1', departureDate = '', arrivalDate = '' }: Record<string, string> = req.query
    try {
      const data = await Tickets.findAll({
        limit: 100,
        include: {
          model: Flights,
          as: 'flight'
        },
        where: {
          '$flight.departureCity$': { [Op.iLike]: `%${departureCity}` },
          '$flight.arrivalCity$': { [Op.iLike]: `%${arrivalCity}` },
          classSeat: { [Op.iLike]: `${classSeat}%` },
          total: { [Op.gte]: parseInt(total) },
          '$flight.departureDate$': { [Op.iLike]: `%${departureDate}` },
          '$flight.arrivalDate$': { [Op.iLike]: `%${arrivalDate}` }
        }
      })

      const count = await Tickets.count({
        limit: 100,
        include: {
          model: Flights,
          as: 'flight'
        },
        where: {
          '$flight.departureCity$': { [Op.iLike]: `%${departureCity}` },
          '$flight.arrivalCity$': { [Op.iLike]: `%${arrivalCity}` },
          classSeat: { [Op.iLike]: `${classSeat}%` },
          total: { [Op.gte]: parseInt(total) },
          '$flight.departureDate$': { [Op.iLike]: `%${departureDate}` },
          '$flight.arrivalDate$': { [Op.iLike]: `%${arrivalDate}` }
        }
      })

      if (data.length === 0) {
        return res.status(404).json({
          status: 'FAILED',
          message: 'Maaf Pencarian Tidak Ditemukan'
        })
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
          include: { model: Flights, as: 'flight' },
          order: [['price', 'ASC']]
        })
      } else if (sortBy === 'duration') { // durasi terpendek
        sortedData = await Tickets.findAll({
          limit: 100,
          include: { model: Flights, as: 'flight' },
          order: [['flight', 'duration', 'ASC']]
        })
      } else if (sortBy === 'departureDateStart') { // keberangkatan paling awal
        sortedData = await Tickets.findAll({
          limit: 100,
          include: { model: Flights, as: 'flight' },
          order: [['flight', 'departureDate', 'ASC']]
        })
      } else if (sortBy === 'departureDateEnd') { // keberangkatan paling akhir
        sortedData = await Tickets.findAll({
          limit: 100,
          include: { model: Flights, as: 'flight' },
          order: [['flight', 'departureDate', 'DESC']]
        })
      } else if (sortBy === 'arrivalDateStart') { // kedatangan paling awal
        sortedData = await Tickets.findAll({
          limit: 100,
          include: { model: Flights, as: 'flight' },
          order: [['flight', 'arrivalDate', 'ASC']]
        })
      } else if (sortBy === 'arrivalDateEnd') { // kedatangan paling akhir
        sortedData = await Tickets.findAll({
          limit: 100,
          include: { model: Flights, as: 'flight' },
          order: [['flight', 'arrivalDate', 'DESC']]
        })
      } else {
        sortedData = await Tickets.findAll({
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
