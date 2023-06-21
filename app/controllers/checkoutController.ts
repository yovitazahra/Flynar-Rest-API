const { Request, Response, NextFunction } = require('express')
const { Users, Checkouts } = require('../models/index')

async function createCheckout(
  req: typeof Request,
  res: typeof Response
): Promise<any> {
  const {
    fullName,
    familyName,
    phoneNumber,
    email,
    price,
    total,
    status,
    ticketId
  } = req.body
  try {
    const newCheckout = await Checkouts.create({
      fullName,
      familyName,
      phoneNumber,
      email,
      price,
      total,
      status,
      ticketId,
      userId: req.id
    })

    res.status(201).json({
      status: 'success',
      data: newCheckout
    })
  } catch (error: any) {
    res.status(400).json({
      status: 'failed',
      msg: error.message
    })
  }
}

async function getCheckouts(
  req: typeof Request,
  res: typeof Response
): Promise<any> {
  try {
    const data = await Checkouts.findAll({
      include: {
        model: Users,
        attributes: ['id', 'name']
      }
    })
    res.status(200).json({
      status: 'success',
      data
    })
  } catch (error: any) {
    res.status(404).json({
      status: 'failed',
      msg: error.message
    })
  }
}

export {}
module.exports = { createCheckout, getCheckouts }
