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
    } catch (error) {
      console.log(error)
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
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'FAILED',
        message: 'Kesalahan Pada Server'
      })
    }
  },
  searchFlightTickets: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
    const { departureCity = '', arrivalCity = '', classSeat = '', total = '1', departureDate = '' }: Record<string, string> = req.query
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
          '$flight.departureDate$': { [Op.iLike]: `%${departureDate}` }
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
          '$flight.departureDate$': { [Op.iLike]: `%${departureDate}` }
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

      if (sortBy === 'price') {
        sortedData = await Tickets.findAll({
          limit: 100,
          order: [['price', 'ASC']]
        })
      } else if (sortBy === 'duration') {
        sortedData = await Tickets.findAll({
          limit: 100,
          include: [{ model: Flights }],
          order: [[{ model: Flights }, 'duration', 'ASC']]
        })
      } else if (sortBy === 'departureDateStart') {
        sortedData = await Tickets.findAll({
          limit: 100,
          include: [{ model: Flights }],
          order: [[{ model: Flights }, 'departureDate', 'ASC']]
        })
      } else if (sortBy === 'departureDateEnd') {
        sortedData = await Tickets.findAll({
          limit: 100,
          include: [{ model: Flights }],
          order: [[{ model: Flights }, 'departureDate', 'DESC']]
        })
      } else if (sortBy === 'returnDateStart') {
        sortedData = await Tickets.findAll({
          limit: 100,
          include: [{ model: Flights }],
          order: [[{ model: Flights }, 'returnDate', 'ASC']]
        })
      } else if (sortBy === 'returnDateEnd') {
        sortedData = await Tickets.findAll({
          limit: 100,
          include: [{ model: Flights }],
          order: [[{ model: Flights }, 'returnDate', 'DESC']]
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
  },
  citySearchOptions: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
    try {
      const direction = req.params.direction
      const cities: any[] = []

      if (direction === 'departure') {
        const result = await Flights.findAll({
          attributes: ['departureCity']
        })

        for (let i = 0; i < result.length; i++) {
          if (!(cities.includes(result[i].departureCity))) {
            cities.push(result[i].departureCity)
          }
        }
      } else if (direction === 'arrival') {
        const result = await Flights.findAll({
          attributes: ['arrivalCity']
        })

        for (let i = 0; i < result.length; i++) {
          if (!(cities.includes(result[i].arrivalCity))) {
            cities.push(result[i].arrivalCity)
          }
        }
      }

      return res.status(200).json({
        status: 'SUCCESS',
        data: cities.toString()
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
