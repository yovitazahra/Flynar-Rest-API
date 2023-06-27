const { Request, Response, NextFunction } = require('express')
const { Tickets, Checkouts } = require('../models/index')

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
    passengers,
    seats,
    ticketId
  } = req.body

  try {
    const selectedTicket = await Tickets.findOne({
      where: { id: ticketId }
    })

    if (selectedTicket.total - total < 0) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'Jumlah Tiket Tidak Cukup'
      })
    }

    await Checkouts.create({
      fullName,
      familyName,
      phoneNumber,
      email,
      price,
      total,
      status,
      passengers,
      seats,
      ticketId,
      userId: req.id
    })

    selectedTicket.total = selectedTicket.total - total
    await selectedTicket.save()

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
      include: {
        model: Tickets,
        as: 'ticket'
      }
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
