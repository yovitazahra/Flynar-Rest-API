const { Request, Response, NextFunction } = require('express')
const { Users, Checkouts } = require('../models/index')

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
      status: 'SUCCESS',
      data: newCheckout
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
        model: Users,
        as: 'user',
        attributes: ['id', 'name']
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
