const ticketsDummy = () => {
  const pricesAndCapacities = [
    [
      { class: 'Economy', price: 5950000, total: 50, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { class: 'Premium Economy', price: 7000000, total: 30, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { class: 'Business', price: 9000000, total: 20, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { class: 'First Class', price: 0, total: 0, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' }
    ],
    [
      { class: 'Economy', price: 7225000, total: 50, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { class: 'Premium Economy', price: 8500000, total: 30, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { class: 'Business', price: 10000000, total: 20, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { class: 'First Class', price: 0, total: 0, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' }],
    [
      { class: 'Economy', price: 8010000, total: 40, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { class: 'Premium Economy', price: 10000000, total: 30, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { class: 'Business', price: 12000000, total: 20, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' },
      { class: 'First Class', price: 15000000, total: 10, label: '', additionalInformation: 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment' }
    ]
  ]

  const tickets = []
  let item = {}

  for (let i = 0; i < 2100; i++) {
    for (let j = 0; j < pricesAndCapacities[i % pricesAndCapacities.length].length; j++) {
      if (pricesAndCapacities[i % pricesAndCapacities.length][j].total > 0) {
        item.flightId = i + 1
        item.class = pricesAndCapacities[i % pricesAndCapacities.length][j].class
        item.price = pricesAndCapacities[i % pricesAndCapacities.length][j].price
        item.total = pricesAndCapacities[i % pricesAndCapacities.length][j].total
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
