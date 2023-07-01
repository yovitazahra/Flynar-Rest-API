/* eslint-disable @typescript-eslint/restrict-template-expressions */
const { Request, Response, NextFunction } = require('express')
const { Tickets, Checkouts } = require('../models/index')
const formatAvailableSeats = require('../utils/formatAvailableSeats')

async function createCheckout (
  req: typeof Request,
  res: typeof Response,
  next: typeof NextFunction
): Promise<any> {
  const {
    fullName = '',
    familyName = '',
    phoneNumber = '',
    email = '',
    price = 0,
    total = 0,
    isRoundTrip = false,
    ticketId = '',
    departureSeat = '',
    returnSeat = '',
    passengersData = ''
  } = req.body

  if (fullName === '' || familyName === '' || phoneNumber === '' || email === '' || total === 0 || ticketId === '' || departureSeat === '' || passengersData === '') {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Mohon Lengkapi Data'
    })
  }

  if (isRoundTrip === true && returnSeat === '') {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Mohon Lengkapi Data'
    })
  }

  const ticketIds = ticketId.split(',')
  const departureSeats = departureSeat.split(',')
  const returnSeats = returnSeat.split(',')
  const passengersDataArray = passengersData.split('|')

  if (isRoundTrip === true) {
    if (ticketIds[0] === '' || ticketIds[1] === '') {
      return res.status(400).json({
        status: 'FAILED',
        message: 'Silahkan Pilih 2 Penerbangan'
      })
    }
    if (departureSeats[0] === '' || departureSeats[1] === '' || returnSeats[0] === '' || returnSeats[1] === '') {
      return res.status(400).json({
        status: 'FAILED',
        message: `Silahkan Pilih ${total} Kursi Untuk Kedua Penerbangan`
      })
    }
    if (passengersDataArray[0] === '' || passengersDataArray[1] === '') {
      return res.status(400).json({
        status: 'FAILED',
        message: 'Lengkapi Data Penumpang'
      })
    }
  }

  if (isRoundTrip === true) {
    if (ticketIds.length !== 2) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'Silahkan Pilih 2 Penerbangan'
      })
    }
  } else {
    if (ticketIds.length !== 1) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'Silahkan Pilih 1 Penerbangan'
      })
    }
  }

  if (total > passengersDataArray.length) {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Lengkapi Data Penumpang'
    })
  } else if (total < passengersDataArray.length) {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Data Penumpang Berlebihan'
    })
  }

  if (isRoundTrip === true) {
    if (departureSeats.length !== total || returnSeats.length !== total) {
      return res.status(400).json({
        status: 'FAILED',
        message: `Silahkan Pilih ${total} Kursi Untuk Kedua Penerbangan`
      })
    }
  } else {
    if (departureSeats.length !== total || returnSeats.length !== total) {
      return res.status(400).json({
        status: 'FAILED',
        message: `Silahkan Pilih ${total} Kursi`
      })
    }
  }

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
            availableSeats[index] = '0'
          } else {
            return res.status(400).json({
              status: 'FAILED',
              message: 'Kursi Sudah Diambil'
            })
          }
        }
      } else {
        for (let j = 0; j < returnSeats.length; j++) {
          const index = availableSeats.indexOf(returnSeats[j])
          if (index > -1) {
            availableSeats[index] = '0'
          } else {
            return res.status(400).json({
              status: 'FAILED',
              message: 'Kursi Sudah Diambil'
            })
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
      status: 'Unpaid',
      isRoundTrip,
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
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ]

  // example query => ?month=6&year=2023&day=23
  const year = req.query.year
  const month = req.query.month
  const day = req.query.day

  try {
    const data = await Checkouts.findAll({
      include: {
        model: Users,
        attributes: ['id', 'name']
      }
    })

    // grouping by year & month
    if (!year || !month || !day) {
      let availableYear = [] as any
      const availableData = [] as any

      data.forEach((checkout: any) => {
        const value = checkout.dataValues
        const year = new Date(value.createdAt).getUTCFullYear()
        availableYear.push(year)
      })

      availableYear = [...new Set(availableYear)]

      const filteredData = availableYear.map((year: number) => {
        return {
          year,
          data: months.map((month: string) => ({
            month,
            checkouts: [] as Checkout[]
          }))
        }
      })

      data.forEach((checkout: any) => {
        const value = checkout.dataValues
        const yearIndex = filteredData.findIndex(
          (data: any) =>
            data.year == new Date(value.createdAt).getUTCFullYear()
        )
        const monthIndex = new Date(value.createdAt).getUTCMonth() + 1
        filteredData[yearIndex].data[monthIndex].checkouts.push(value)
      })

      for (let i = 0; i < availableYear.length; i++) {
        for (let j = 0; j < months.length; j++) {
          if (filteredData[i].data[j].checkouts.length > 0) {
            availableData.push({
              year: filteredData[i].year.toString(),
              data: {
                month: filteredData[i].data[j].month,
                checkouts: filteredData[i].data[j].checkouts
              }
            })
          }
        }
      }

      res.status(200).json({
        status: 'success',
        data: availableData
        // data: filteredData <= to display all data
      })
    }
    // selected specific date depend on url query
    else {
      const filteredData = [] as Checkout[]
      data.forEach((checkout: any) => {
        const value = checkout.dataValues
        if (
          new Date(value.createdAt).toLocaleDateString() ==
                  new Date(`${year}-${month}-${day}`).toLocaleDateString()
        ) {
          filteredData.push(value)
        }
      })

      res.status(200).json({
        status: 'success',
        data: filteredData
      })
    }
  } catch (error: any) {
    res.status(404).json({
      status: 'failed',
      msg: error.message
    })
  }
}

async function cancelCheckout (
  req: typeof Request,
  res: typeof Response
): Promise<any> {
  const { id } = req.body
  try {
    const selectedCheckout = await Checkouts.findOne({
      where: { id }
    })

    if (selectedCheckout === null) {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Transaksi Tidak Ditemukan'
      })
    }

    if (selectedCheckout.status === 'Cancelled') {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Transaksi Sudah Batal'
      })
    }

    if (selectedCheckout.status === 'Issued') {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Transaksi Sudah Lunas'
      })
    }

    const ticketIds = selectedCheckout.ticketId.split(',')
    const departureSeats = selectedCheckout.departureSeat.split(',')
    const returnSeats = selectedCheckout.returnSeat.split(',')

    let selectedTicket
    for (let i = 0; i < ticketIds.length; i++) {
      selectedTicket = await Tickets.findOne({
        where: { id: parseInt(ticketIds[i]) }
      })

      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      selectedTicket.total += selectedCheckout.total
      const availableSeats = selectedTicket.availableSeat.split(',')

      if (i === 0) {
        for (let j = 0; j < departureSeats.length; j++) {
          if (availableSeats[parseInt(departureSeats[j]) - 1] === '0') {
            availableSeats[parseInt(departureSeats[j]) - 1] = departureSeats[j]
          }
        }
      } else {
        for (let j = 0; j < returnSeats.length; j++) {
          if (availableSeats[parseInt(returnSeats[j]) - 1] === '0') {
            availableSeats[parseInt(returnSeats[j]) - 1] = returnSeats[j]
          }
        }
      }

      selectedTicket.availableSeat = formatAvailableSeats(availableSeats)
      selectedCheckout.status = 'Cancelled'

      await selectedCheckout.save()
      await selectedTicket.save()
    }
    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Transaksi Dibatalkan'
    })
  } catch (error: any) {
    res.status(500).json({
      status: 'FAILED',
      message: error.message
    })
  }
}

async function payCheckout (
  req: typeof Request,
  res: typeof Response
): Promise<any> {
  const { id } = req.body
  try {
    const selectedCheckout = await Checkouts.findOne({
      where: { id }
    })

    if (selectedCheckout === null) {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Transaksi Tidak Ditemukan'
      })
    }

    if (selectedCheckout.status === 'Cancelled') {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Transaksi Sudah Batal'
      })
    }

    if (selectedCheckout.status === 'Issued') {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Transaksi Sudah Lunas'
      })
    }

    selectedCheckout.status = 'Issued'
    await selectedCheckout.save()

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Transaksi Sukses'
    })
  } catch (error: any) {
    res.status(500).json({
      status: 'FAILED',
      message: error.message
    })
  }
}

export {}
module.exports = { createCheckout, getCheckouts, cancelCheckout, payCheckout }
