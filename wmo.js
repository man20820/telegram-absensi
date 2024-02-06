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
      break
    case 11:
      weatherString = 'Patches, shallow fog or ice fog at the station, whether on land or sea, not deeper than about 2 metres on land or 10 metres at sea'
      break
    case 12:
      weatherString = 'More or less continuous, shallow fog or ice fog at the station, whether on land or sea, not deeper than about 2 metres on land or 10 metres at sea'
      break
    case 13:
      weatherString = 'Lightning visible, no thunder heard'
      break
    case 14:
      weatherString = 'Precipitation within sight, not reaching the ground or the surface of the sea'
      break
    case 15:
      weatherString = 'Precipitation within sight, reaching the ground or the surface of the sea, but distant, i.e. estimated to be more than 5 km from the station'
      break
    case 16:
      weatherString = 'Precipitation within sight, reaching the ground or the surface of the sea, near to, but not at the station'
      break
    case 17:
      weatherString = 'Thunderstorm, but no precipitation at the time of observation'
      break
    case 18:
      weatherString = 'Squalls, at or within sight of the station during the preceding hour or at the time of observation'
      break
    case 19:
      weatherString = 'Funnel cloud(s)**, at or within sight of the station during the preceding hour or at the time of observation, Tornado cloud or water-spout'
      break
    case 20:
      weatherString = 'Drizzle (not freezing) or snow grains, not falling as shower(s)'
      break
    case 21:
      weatherString = 'Rain (not freezing), not falling as shower(s)'
      break
    case 22:
      weatherString = 'Snow, not falling as shower(s)'
      break
    case 23:
      weatherString = 'Rain and snow or ice pellets, not falling as shower(s)'
      break
    case 24:
      weatherString = 'Freezing drizzle or freezing rain, not falling as shower(s)'
      break
    case 25:
      weatherString = 'Shower(s) of rain'
      break
    case 26:
      weatherString = 'Shower(s) of snow, or of rain and snow'
      break
    case 27:
      weatherString = 'Shower(s) of hail*, or of rain and hail*'
      break
    case 28:
      weatherString = 'Fog or ice fog'
      break
    case 29:
      weatherString = 'Thunderstorm (with or without precipitation)'
      break
    case 30:
      weatherString = 'Slight or moderate duststorm or sandstorm, has decreased during the preceding hour'
      break
    case 31:
      weatherString = 'Slight or moderate duststorm or sandstorm, no appreciable change during the preceding hour'
      break
    case 32:
      weatherString = 'Slight or moderate duststorm or sandstorm, has begun or has increased during the preceding hour'
      break
    case 33:
      weatherString = 'Severe duststorm or sandstorm, has decreased during the preceding hour'
      break
    case 34:
      weatherString = 'Severe duststorm or sandstorm, no appreciable change during the preceding hour'
      break
    case 35:
      weatherString = 'Severe duststorm or sandstorm, has begun or has increased during the preceding hour'
      break
    case 36:
      weatherString = 'Slight or moderate blowing snow, generally low (below eye level)'
      break
    case 37:
      weatherString = 'Heavy drifting snow, generally low (below eye level)'
      break
    case 38:
      weatherString = 'Slight or moderate blowing snow, generally high (above eye level)'
      break
    case 39:
      weatherString = 'Heavy drifting snow, generally high (above eye level)'
      break
    case 40:
      weatherString = 'Fog or ice fog at a distance at the time of observation, but not at the station during the preceding hour, the fog or ice fog extending to a level above that of the observer'
      break
    case 41:
      weatherString = 'Fog or ice fog in patches'
      break
    case 42:
      weatherString = 'Fog or ice fog, sky visible, has become thinner during the preceding hour'
      break
    case 43:
      weatherString = 'Fog or ice fog, sky invisible, has become thinner during the preceding hour'
      break
    case 44:
      weatherString = 'Fog or ice fog, sky visible, no appreciable change during the preceding hour'
      break
    case 45:
      weatherString = 'Fog or ice fog, sky invisible, no appreciable change during the preceding hour'
      break
    case 46:
      weatherString = 'Fog or ice fog, sky visible, has begun or has become thicker during the preceding hour'
      break
    case 47:
      weatherString = 'Fog or ice fog, sky invisible, has begun or has become thicker during the preceding hour'
      break
    case 48:
      weatherString = 'Fog, depositing rime, sky visible'
      break
    case 49:
      weatherString = 'Fog, depositing rime, sky invisible'
      break
    case 50:
      weatherString = 'Drizzle, not freezing, intermittent, slight at time of observation'
      break
    case 51:
      weatherString = 'Drizzle, not freezing, continuous, slight at time of observation'
      break
    case 52:
      weatherString = 'Drizzle, not freezing, intermittent, moderate at time of observation'
      break
    case 53:
      weatherString = 'Drizzle, not freezing, continuous, moderate at time of observation'
      break
    case 54:
      weatherString = 'Drizzle, not freezing, intermittent, heavy (dense) at time of observation'
      break
    case 55:
      weatherString = 'Drizzle, not freezing, continuous, heavy (dense) at time of observation'
      break
    case 56:
      weatherString = 'Drizzle, freezing, slight'
      break
    case 57:
      weatherString = 'Drizzle, freezing, moderate or heavy (dence)'
      break
    case 58:
      weatherString = 'Drizzle and rain, slight'
      break
    case 59:
      weatherString = 'Drizzle and rain, moderate or heavy'
      break
    case 60:
      weatherString = 'Rain, not freezing, intermittent, slight at time of observation'
      break
    case 61:
      weatherString = 'Rain, not freezing, continuous, slight at time of observation'
      break
    case 62:
      weatherString = 'Rain, not freezing, intermittent, moderate at time of observation'
      break
    case 63:
      weatherString = 'Rain, not freezing, continuous, moderate at time of observation'
      break
    case 64:
      weatherString = 'Rain, not freezing, intermittent, heavy at time of observation'
      break
    case 65:
      weatherString = 'Rain, not freezing, continuous, heavy at time of observation'
      break
    case 66:
      weatherString = 'Rain, freezing, slight'
      break
    case 67:
      weatherString = 'Rain, freezing, moderate or heavy (dence)'
      break
    case 68:
      weatherString = 'Rain or drizzle and snow, slight'
      break
    case 69:
      weatherString = 'Rain or drizzle and snow, moderate or heavy'
      break
    case 70:
      weatherString = 'Intermittent fall of snowflakes, slight at time of observation'
      break
    case 71:
      weatherString = 'Continuous fall of snowflakes, slight at time of observation'
      break
    case 72:
      weatherString = 'Intermittent fall of snowflakes, moderate at time of observation'
      break
    case 73:
      weatherString = 'Continuous fall of snowflakes, moderate at time of observation'
      break
    case 74:
      weatherString = 'Intermittent fall of snowflakes, heavy at time of observation'
      break
    case 75:
      weatherString = 'Continuous fall of snowflakes, heavy at time of observation'
      break
    case 76:
      weatherString = 'Diamond dust (with or without fog)'
      break
    case 77:
      weatherString = 'Snow grains (with or without fog)'
      break
    case 78:
      weatherString = 'Isolated star-like snow crystals (with or without fog)'
      break
    case 79:
      weatherString = 'Ice pellets'
      break
    case 80:
      weatherString = 'Rain shower(s), slight'
      break
    case 81:
      weatherString = 'Rain shower(s), moderate or heavy'
      break
    case 82:
      weatherString = 'Rain shower(s), violent'
      break
    case 83:
      weatherString = 'Shower(s) of rain and snow mixed, slight'
      break
    case 84:
      weatherString = 'Shower(s) of rain and snow mixed, moderate or heavy'
      break
    case 85:
      weatherString = 'Snow shower(s), slight'
      break
    case 86:
      weatherString = 'Snow shower(s), moderate or heavy'
      break
    case 87:
      weatherString = 'Shower(s) of snow pellets or small hail, with or without rain or rain and snow mixed, - slight'
      break
    case 88:
      weatherString = 'Shower(s) of snow pellets or small hail, with or without rain or rain and snow mixed, - moderate or heavy'
      break
    case 89:
      weatherString = 'Shower(s) of hail*, with or without rain or rain and snow mixed, not associated with thunder, - slight'
      break
    case 90:
      weatherString = 'Shower(s) of hail*, with or without rain or rain and snow mixed, not associated with thunder, - moderate or heavy'
      break
    case 91:
      weatherString = 'Slight rain at time of observation, Thunderstorm during the preceding hour but not at time of observation'
      break
    case 92:
      weatherString = 'Moderate or heavy rain at time of observation, Thunderstorm during the preceding hour but not at time of observation'
      break
    case 93:
      weatherString = 'Slight snow, or rain and snow mixed or hail** at time of observation, Thunderstorm during the preceding hour but not at time of observation'
      break
    case 94:
      weatherString = 'Moderate or heavy snow, or rain and snow mixed or hail** at time of observation, Thunderstorm during the preceding hour but not at time of observation'
      break
    case 95:
      weatherString = 'Thunderstorm, slight or moderate, without hail** but with rain and/or snow at time of observation, Thunderstorm at time of observation'
      break
    case 96:
      weatherString = 'Thunderstorm, slight or moderate, with hail** at time of observation, Thunderstorm at time of observation'
      break
    case 97:
      weatherString = 'Thunderstorm, heavy, without hail** but with rain and/or snow at time of observation, Thunderstorm at time of observation'
      break
    case 98:
      weatherString = 'Thunderstorm combined with duststorm or sandstorm at time of observation, Thunderstorm at time of observation'
      break
    case 99:
      weatherString = 'Thunderstorm, heavy, with hail** at time of observation, Thunderstorm at time of observation'
  }
  return weatherString
}
module.exports = {
  matchWmoCode
}
