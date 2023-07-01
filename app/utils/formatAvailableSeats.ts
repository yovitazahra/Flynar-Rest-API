const formatAvailableSeats = (array: string[]): string => {
  let seatsInString = ''
  for (let i = 0; i < array.length; i++) {
    seatsInString += array[i]

    if (i !== array.length - 1) {
      seatsInString += ','
    }
  }
  return seatsInString
}

module.exports = formatAvailableSeats
