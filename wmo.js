const matchWmoCode = (weatherCode) => {
  let weatherString
  switch (weatherCode) {
    case 0:
      weatherString = 'Cloud development not observed or not observable, Characteristic change of the state of sky during the past hour'
      break
    case 1:
      weatherString = 'Clouds generally dissolving or becoming less developed, Characteristic change of the state of sky during the past hour'
      break
    case 2:
      weatherString = 'State of sky on the whole unchanged, Characteristic change of the state of sky during the past hour'
      break
    case 3:
      weatherString = 'Clouds generally forming or developing, Characteristic change of the state of sky during the past hour'
      break
    case 4:
      weatherString = 'Visibility reduced by smoke, e.g. veldt or forest fires, industrial smoke or volcanic ashes'
      break
    case 5:
      weatherString = 'Haze'
      break
    case 6:
      weatherString = 'Widespread dust in suspension in the air, not raised by wind at or near the station at the time of observation'
      break
    case 7:
      weatherString = 'Dust or sand raised by wind at or near the station at the time of observation, but no well developed dust whirl(s) or sand whirl(s), and no duststorm or sandstorm seen'
      break
    case 8:
      weatherString = 'Well developed dust whirl(s) or sand whirl(s) seen at or near the station during the preceding hour or at the time ot observation, but no duststorm or sandstorm'
      break
    case 9:
      weatherString = 'Duststorm or sandstorm within sight at the time of observation, or at the station during the preceding hour'
      break
    case 10:
      weatherString = 'Mist'
  }
  return weatherString
}
module.exports = {
  matchWmoCode
}
