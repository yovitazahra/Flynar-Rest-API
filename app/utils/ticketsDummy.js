const ticketsDummy = () => {
  const createAvailableSeats = (total) => {
    let string = ''
    for (let i = 1; i <= total; i++) {
      string += i

      if (i !== total) {
        string += ','
      }
    }
    return string
  }

  const pricesAndCapacities = [
    [
      { classSeat: 'Economy', price: 5950000, total: 50, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { classSeat: 'Premium Economy', price: 7000000, total: 30, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { classSeat: 'Business', price: 9000000, total: 20, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { classSeat: 'First Class', price: 0, total: 0, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' }
    ],
    [
      { classSeat: 'Economy', price: 7225000, total: 50, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { classSeat: 'Premium Economy', price: 8500000, total: 30, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { classSeat: 'Business', price: 10000000, total: 20, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { classSeat: 'First Class', price: 0, total: 0, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' }
    ],
    [
      { classSeat: 'Economy', price: 8010000, total: 40, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { classSeat: 'Premium Economy', price: 10000000, total: 30, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { classSeat: 'Business', price: 12000000, total: 20, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { classSeat: 'First Class', price: 15000000, total: 10, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' }
    ]
  ]

  const tickets = []
  let item = {}

  for (let i = 0; i < 2100; i++) {
    for (let j = 0; j < pricesAndCapacities[i % pricesAndCapacities.length].length; j++) {
      if (pricesAndCapacities[i % pricesAndCapacities.length][j].total > 0) {
        item.flightId = i + 1
        item.classSeat = pricesAndCapacities[i % pricesAndCapacities.length][j].classSeat
        item.price = pricesAndCapacities[i % pricesAndCapacities.length][j].price
        item.total = pricesAndCapacities[i % pricesAndCapacities.length][j].total
        item.availableSeat = createAvailableSeats(pricesAndCapacities[i % pricesAndCapacities.length][j].total)
        item.label = pricesAndCapacities[i % pricesAndCapacities.length][j].label
        item.additionalInformation = pricesAndCapacities[i % pricesAndCapacities.length][j].additionalInformation
        item.createdAt = new Date()
        item.updatedAt = new Date()
        tickets.push(item)
        item = {}
      }
    }
  }

  return tickets
}

ticketsDummy()

module.exports = ticketsDummy
