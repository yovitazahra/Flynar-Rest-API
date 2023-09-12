const dayjs = require('dayjs')

const findArrivalDate = (departureDate, departureTime, arrivalTime) => {
  if (arrivalTime > departureTime) {
    return departureDate
  } else {
    return `${dayjs(departureDate).add(1, 'days')}`
  }
}

module.exports = findArrivalDate
