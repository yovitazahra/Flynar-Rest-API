const flightsDummy = () => {
  const dates = ['2023-07-06', '2023-07-07', '2023-07-08', '2023-07-09', '2023-07-10', '2023-07-11', '2023-07-12', '2023-07-13', '2023-07-14', '2023-07-15']

  const airlines = [
    { name: 'Jet Air', code: 'JT' },
    // { name: 'TransNusa', code: 'TN' },
    { name: 'Lion Air', code: 'LA' },
    { name: 'Garuda Indonesia', code: 'GI' },
    { name: 'AirAsia Indonesia', code: 'AA' },
    // { name: 'Batik Air', code: 'BA' },
    { name: 'Emirates', code: 'ES' }
    // { name: 'Etihad Airways', code: 'EA' },
    // { name: 'Sriwijaya Air', code: 'SA' }
    // { name: 'Citilink', code: 'CL' }
  ]

  const citiesAndAirports = [
    { city: 'Jakarta', airport: 'Bandara Soekarno Hatta' },
    { city: 'Tokyo', airport: 'Haneda Airport' },
    { city: 'Surabaya', airport: 'Bandara Djuanda' },
    { city: 'Denpasar', airport: 'Bandara Internasional Ngurah Rai' },
    // { city: 'Medan', airport: 'Bandara Internasional Kualanamu' },
    { city: 'Los Angeles', airport: 'Los Angeles International Airport' },
    // { city: 'New York', airport: 'John F Kennedy International Airport' },
    { city: 'Makassar', airport: 'Bandara Hasanuddin' },
    { city: 'Bangkok', airport: 'Suvarnabhumi Airport' },
    { city: 'Sydney', airport: 'Sydney Airport' }
    // { city: 'Istanbul', airport: 'Istanbul Airport' }
    // { city: 'Manila', airport: 'Ninoy Aquino International Airport' }
    // { city: 'Melbourne', airport: 'Melbourne International Airport' }
  ]

  const times = [
    { departureTime: '08:00:00.000', arrivalTime: '12:00:00.000' },
    { departureTime: '13:15:00.000', arrivalTime: '17:15:00.000' },
    { departureTime: '20:15:00.000', arrivalTime: '23:30:00.000' }
  ]

  // const pricesAndCapacities = [
  //   { economyPrice: 5950000, economyCapacity: 50, premiumEconomyPrice: 7000000, premiumEconomyCapacity: 30, businessPrice: 9000000, businessCapacity: 20, firstClassPrice: 0, firstClassCapacity: 0 },
  //   { economyPrice: 7225000, economyCapacity: 50, premiumEconomyPrice: 8500000, premiumEconomyCapacity: 30, businessPrice: 10000000, businessCapacity: 20, firstClassPrice: 0, firstClassCapacity: 0 },
  //   { economyPrice: 8010000, economyCapacity: 40, premiumEconomyPrice: 30, premiumEconomyCapacity: 10000000, businessPrice: 12000000, businessCapacity: 20, firstClassPrice: 15000000, firstClassCapacity: 10 }
  // ]

  const flights = []

  for (let i = 0; i < dates.length; i++) {
    for (let j = 0; j < airlines.length; j++) {
      for (let k = 0; k < citiesAndAirports.length; k++) {
        for (let l = 0; l < citiesAndAirports.length; l++) {
          if (k === l) {
            continue
          }
          for (let m = 0; m < times.length; m++) {
            let item = {}
            const code = airlines[j].code + '-' + (i < 10 ? '0' + i : i) + (j < 10 ? '0' + j : j) + (k < 10 ? '0' + k : k) + (l < 10 ? '0' + l : l) + (m < 10 ? '0' + m : m)
            item.flightCode = code
            item.airline = airlines[j].name
            item.departureAirport = citiesAndAirports[k].airport
            item.arrivalAirport = citiesAndAirports[l].airport
            item.departureCity = citiesAndAirports[k].city
            item.arrivalCity = citiesAndAirports[l].city
            item.departureDate = dates[i]
            item.arrivalDate = dates[i]
            item.departureTime = times[m].departureTime
            item.arrivalTime = times[m].arrivalTime
            // item.label = ''
            // item.economyPrice = pricesAndCapacities[m].economyPrice
            // item.economyCapacity = pricesAndCapacities[m].economyCapacity
            // item.premiumEconomyPrice = pricesAndCapacities[m].premiumEconomyPrice
            // item.premiumEconomyCapacity = pricesAndCapacities[m].premiumEconomyCapacity
            // item.businessPrice = pricesAndCapacities[m].businessPrice
            // item.businessCapacity = pricesAndCapacities[m].businessCapacity
            // item.firstClassPrice = pricesAndCapacities[m].firstClassPrice
            // item.firstClassCapacity = pricesAndCapacities[m].firstClassCapacity
            // item.additionalInformation = 'Baggage 20 kg,Cabin Baggage 7kg,In Flight Entertaiment'
            item.createdAt = new Date()
            item.updatedAt = new Date()
            flights.push(item)
            item = {}
          }
        }
      }
    }
  }

  return flights
}

module.exports = flightsDummy
