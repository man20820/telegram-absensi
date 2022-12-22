const dayjs = require('dayjs')
const timezone = require('dayjs/plugin/timezone')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)
dayjs.extend(timezone)

const tz = 'Asia/Jakarta'

const now = () => {
  return dayjs().tz(tz)
}

const getUsernamesAndBody = (message) => {
  const regex = /(?:(@\w{1,16})\b){1,}/g
  const usernames = []

  let match = false
  do {
    match = regex.exec(message)
    if (match) {
      usernames.push(match[1])
    }
  } while (match)

  return usernames
}

module.exports = {
  now,
  getUsernamesAndBody
}
