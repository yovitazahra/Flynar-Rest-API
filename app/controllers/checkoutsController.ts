const { Request, Response, NextFunction } = require('express')
const { Tickets, Checkouts } = require('../models/index')
const formatAvailableSeats = require('../utils/formatAvailableSeats')

async function createCheckout (
  req: typeof Request,
  res: typeof Response,
  next: typeof NextFunction
): Promise<any> {
  const {
    fullName,
    familyName,
    phoneNumber,
    email,
    price,
    total,
    status,
    ticketId,
    departureSeat,
    returnSeat,
    passengersData
  } = req.body

  const ticketIds = ticketId.split(',')
  const departureSeats = departureSeat.split(',')
  const returnSeats = returnSeat.split(',')

  try {
    let selectedTicket
    for (let i = 0; i < ticketIds.length; i++) {
      selectedTicket = await Tickets.findOne({
        where: { id: parseInt(ticketIds[i]) }
      })

      if (selectedTicket.total - total < 0) {
        return res.status(400).json({
          status: 'FAILED',
          message: 'Jumlah Tiket Tidak Cukup'
        })
      }

      const availableSeats = selectedTicket.availableSeat.split(',')

      if (i === 0) {
        for (let j = 0; j < departureSeats.length; j++) {
          const index = availableSeats.indexOf(departureSeats[j])
          if (index > -1) {
            availableSeats.splice(index, 1)
          }
        }
      } else {
        for (let j = 0; j < returnSeats.length; j++) {
          const index = availableSeats.indexOf(returnSeats[j])
          if (index > -1) {
            availableSeats.splice(index, 1)
          }
        }
      }

      selectedTicket.availableSeat = formatAvailableSeats(availableSeats)
      selectedTicket.total = selectedTicket.total - total
      await selectedTicket.save()
    }

    await Checkouts.create({
      fullName,
      familyName,
      phoneNumber,
      email,
      price,
      total,
      status,
      ticketId,
      departureSeat,
      returnSeat,
      passengersData,
      userId: req.id
    })

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Transaksi Dibuat'
    })
  } catch (error: any) {
    res.status(400).json({
      status: 'FAILED',
      message: error.message
    })
  }
}

async function getCheckouts (
  req: typeof Request,
  res: typeof Response
): Promise<any> {
  try {
    const data = await Checkouts.findAll({
      // include: {
      //   model: Tickets,
      //   as: 'ticket'
      // }
    })
    res.status(200).json({
      status: 'SUCCESS',
      data
    })
  } catch (error: any) {
    res.status(404).json({
      status: 'FAILED',
      message: error.message
    })
  }
}

export {}
module.exports = { createCheckout, getCheckouts }
