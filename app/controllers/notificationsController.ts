const { Request, Response } = require('express')
const { Notifications } = require('../models/index')

async function getNotifications (
  req: typeof Request,
  res: typeof Response
): Promise<any> {
  try {
    const data = await Notifications.findAll({ where: { userId: req.id } })

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

async function readNotification (
  req: typeof Request,
  res: typeof Response
): Promise<any> {
  const { id } = req.body
  const notification = await Notifications.findOne({
    where: {
      id
    }
  })

  notification.isRead = true
  await notification.save()

  res.status(201).json({
    status: 'SUCCESS',
    message: 'Notifikasi Dibaca'
  })
}

async function createNotification (
  req: typeof Request,
  res: typeof Response
): Promise<any> {
  const { title = '', label = '', text = '' } = req.body
  try {
    await Notifications.create({
      title,
      label,
      text,
      isRead: false,
      userId: req.id
    })

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Notifikasi Dibuat'
    })
  } catch (error: any) {
    res.status(404).json({
      status: 'FAILED',
      message: error.message
    })
  }
}
module.exports = { getNotifications, readNotification, createNotification }
