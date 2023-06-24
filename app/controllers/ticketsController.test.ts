const { Tickets } = require('../models/index')
const TicketsController = require('./ticketsController')

describe('#handleListTicket', () => {
  it('should call res.status(200) and list of ticket', async () => {
    const flightId = 1
    const classTicket = 'string'
    const total = 1
    const price = 1
    const label = 'string'
    const additionalInformation = 'string'

    const tickets = []
    for (let i = 0; i < 10; i++) {
      const ticket = new Tickets({
        flightId,
        classTicket,
        total,
        price,
        label,
        additionalInformation
      })
      tickets.push(ticket)
    }
    const mockRequest = {
      body: {}
    }

    const mockTicketModel = {
      findAll: jest.fn().mockReturnValue(tickets),
      count: jest.fn().mockReturnValue(10)
    }
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    const ticketsController = new TicketsController()
    await ticketsController.ticketList(mockRequest, mockResponse)

    expect(mockTicketModel.findAll).toHaveBeenCalledWith({
      limit: 10
    })
    expect(mockTicketModel.count).toHaveBeenCalledWith(10)
    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.json).toHaveBeenCalledWith(tickets)
  })
})
