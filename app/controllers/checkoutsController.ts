/* eslint-disable @typescript-eslint/restrict-template-expressions */
const { Request, Response, NextFunction } = require('express')
const { Tickets, Checkouts, Flights, Notifications } = require('../models/index')
const formatAvailableSeats = require('../utils/formatAvailableSeats')

async function createCheckoutFromHomePage (
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

  try {
    const response = await Checkouts.create({
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
      message: 'Transaksi Dibuat',
      id: response.dataValues.id
    })
  } catch (error: any) {
    res.status(400).json({
      status: 'FAILED',
      message: error.message
    })
  }
}

async function finishCheckout (
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

    const response = await Checkouts.create({
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

    await Notifications.create({
      title: 'Transkasi Berhasil Dibuat',
      label: 'Notifikasi',
      text: 'Transaksi berhasil dibuat, silahkan lakukan pembayaran secepatnya',
      isRead: false,
      userId: req.id
    })

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Transaksi Dibuat',
      id: response.dataValues.id
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

  const date = req.query.date
  const year = req.query.year
  const month = req.query.month

  try {
    const data = await Checkouts.findAll({
      where: {
        userId: req.id
      }
    })

    if (date === undefined) {
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
            checkouts: []
          }))
        }
      })

      for (let h = 0; h < data.length; h++) {
        const value = data[h].dataValues
        const flightIds = []
        const ticketIds = value.ticketId.split(',')

        for (let i = 0; i < ticketIds.length; i++) {
          const ticket: Record<string, any> = await findTicket(parseInt(ticketIds[i]))
          flightIds.push(ticket.dataValues.flightId)
        }

        const flights = []
        for (let i = 0; i < flightIds.length; i++) {
          const flight: Record<string, any> = await findFlight(flightIds[i])
          flights.push(flight.dataValues)
        }

        const yearIndex = filteredData.findIndex(
          (data: any) =>
            data.year === new Date(value.createdAt).getUTCFullYear()
        )

        value.flights = flights
        const monthIndex = new Date(value.createdAt).getMonth()
        filteredData[yearIndex].data[monthIndex].checkouts.push(value)
      }

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
        status: 'SUCCESS',
        data: availableData
      })
    } else {
      const filteredData: any[] = []
      for (let h = 0; h < data.length; h++) {
        const value = data[h].dataValues
        const flightIds = []
        const ticketIds = value.ticketId.split(',')

        for (let i = 0; i < ticketIds.length; i++) {
          const ticket: Record<string, any> = await findTicket(parseInt(ticketIds[i]))
          flightIds.push(ticket.dataValues.flightId)
        }

        const flights = []
        for (let i = 0; i < flightIds.length; i++) {
          const flight: Record<string, any> = await findFlight(flightIds[i])
          flights.push(flight.dataValues)
        }

        for (let i = 0; i < flights.length; i++) {
          if (
            new Date(flights[i].departureDate).toLocaleDateString() === new Date(`${year}-${month}-${date}`).toLocaleDateString() ||
            new Date(flights[i].returnDate).toLocaleDateString() === new Date(`${year}-${month}-${date}`).toLocaleDateString()
          ) {
            value.flights = flights[i]
            filteredData.push(value)
          }
        }
      }

      res.status(200).json({
        status: 'SUCCESS',
        data: filteredData
      })
    }
  } catch (error: any) {
    res.status(404).json({
      status: 'FAILED',
      message: error.message
    })
  }
}

async function findTicket (ticketId: number): Promise<any> {
  const ticket = await Tickets.findOne({
    where: {
      id: ticketId
    }
  })
  return ticket
}

async function findFlight (flightId: number): Promise<any> {
  const flight = await Flights.findOne({
    where: {
      id: flightId
    }
  })
  return flight
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

    await Notifications.create({
      title: 'Transkasi Batal',
      label: 'Notifikasi',
      text: 'Transaksi berhasil dibatalkan, silahkan lainnya dari kami',
      isRead: false,
      userId: req.id
    })

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

    await Notifications.create({
      title: 'Transkasi Sukses',
      label: 'Notifikasi',
      text: 'Terima kasih sudah melakukan pembayaran',
      isRead: false,
      userId: req.id
    })

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
module.exports = { createCheckoutFromHomePage, finishCheckout, getCheckouts, cancelCheckout, payCheckout }
