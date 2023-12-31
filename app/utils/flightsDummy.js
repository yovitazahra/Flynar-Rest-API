const findArrivalDate = require('./findArrivalDate')

const dates = ['2023-10-06', '2023-10-07', '2023-10-08', '2023-10-09', '2023-10-10', '2023-10-11', '2023-10-12']

const airlines = [{
  name: 'JetStar',
  code: 'JQ'
},
{
  name: 'Batik Air',
  code: 'ID'
},
{
  name: 'Garuda Indonesia',
  code: 'GA'
},
{
  name: 'AirAsia',
  code: 'AK'
},
{
  name: 'Etihad Airways',
  code: 'EY'
}
  // { name: 'Batik Air', code: 'BA' },
  // { name: 'TransNusa', code: 'TN' },
  // {name: 'Emirates',  code: 'ES' }
  // { name: 'Sriwijaya Air', code: 'SA' }
  // { name: 'Citilink', code: 'CL' }
]

const citiesAndAirports = [{
  city: 'Jakarta',
  airport: 'Bandara Soekarno Hatta'
},
// { city: 'Tokyo', airport: 'Haneda Airport' },
{
  city: 'Surabaya',
  airport: 'Bandara Djuanda'
},
{
  city: 'Denpasar',
  airport: 'Bandara Internasional Ngurah Rai'
},
{
  city: 'Medan',
  airport: 'Bandara Internasional Kualanamu'
},
// { city: 'Los Angeles', airport: 'Los Angeles International Airport' },
// { city: 'New York', airport: 'John F Kennedy International Airport' },
{
  city: 'Makassar',
  airport: 'Bandara Hasanuddin'
}
  // { city: 'Bangkok', airport: 'Suvarnabhumi Airport' },
  // { city: 'Sydney', airport: 'Sydney Airport' }
  // { city: 'Istanbul', airport: 'Istanbul Airport' }
  // { city: 'Manila', airport: 'Ninoy Aquino International Airport' }
  // { city: 'Melbourne', airport: 'Melbourne International Airport' }
]

const times = [
  {
    departureTime: '08:00:00.000',
    arrivalTime: '12:00:00.000',
    duration: '04:00:00.000'
  },
  {
    departureTime: '13:15:00.000',
    arrivalTime: '17:15:00.000',
    duration: '04:00:00.000'
  },
  {
    departureTime: '20:15:00.000',
    arrivalTime: '23:30:00.000',
    duration: '03:15:00.000'
  }
]

const flightsDummy = () => {
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
            item.airlineCode = airlines[j].code
            item.departureAirport = citiesAndAirports[k].airport
            item.arrivalAirport = citiesAndAirports[l].airport
            item.departureCity = citiesAndAirports[k].city
            item.arrivalCity = citiesAndAirports[l].city
            item.departureDate = dates[i]
            item.departureTime = times[m].departureTime
            item.arrivalDate = findArrivalDate(dates[i], times[m].departureTime, times[m].arrivalTime)
            item.arrivalTime = times[m].arrivalTime
            item.duration = times[m].duration
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

module.exports = { flightsDummy, citiesAndAirports }
