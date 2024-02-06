require('dotenv').config()
const mongoose = require('mongoose')
const { Telegraf, Input } = require('telegraf')
const { message } = require('telegraf/filters')
const { getUsernamesAndBody, now } = require('./helper')
const { matchWmoCode } = require('./wmo')
const { getCapture } = require('./rtsp')
const cron = require('node-cron')
const axios = require('axios')
const fs = require('fs')

// mongodb connection
const connection = mongoose.connection
connection.on('error', (err) => console.error(err))
connection.once('open', () => {
  console.log('mongodb success')
})
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/absensi'
mongoose.set('strictQuery', false)
mongoose.connect(uri, {
  useNewUrlParser: true
})

const ABSENSI = require('./models/absensi')
const STICKER = require('./models/sticker')
const STICKEROWNER = require('./models/sticker_owner')

// bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
const meteoWeather = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.open-meteo.com/v1/forecast?latitude=-7.7961&longitude=110.3208&current=temperature_2m,rain,weather_code&timezone=Asia%2FBangkok',
  headers: { }
}
const getWeather = () => {
  axios.request(meteoWeather)
    .then((response) => {
      // console.log(JSON.stringify(response.data))
      const temperature = response.data.current.temperature_2m
      const rain = response.data.current.rain
      const weatherCode = response.data.current.weather_code
      const weatherString = matchWmoCode(weatherCode)
      const message = `Prakiraan cuaca kantor Ambarketawang:\nTemperatur: ${temperature}°C\nHujan: ${rain}mm(inch)/hour\nKeterangan: ${weatherString}`
      console.log(message)
      bot.telegram.sendMessage(process.env.TELEGRAM_REPORT_CHAT_ID, message)
    })
    .catch((error) => {
      console.log(error)
    })
}

const getCaptureFileName = async () => {
  try {
    await getCapture.captureImage(() => {
      const ffmpegCommand = getCapture.writeStream.spawnargs
      const fileName = ffmpegCommand.slice(-1).toString()
      console.log(fileName)
      if (fs.existsSync(fileName)) {
        bot.telegram.sendPhoto(process.env.TELEGRAM_REPORT_CHAT_ID, { source: fileName })
      } else {
        bot.telegram.sendMessage(process.env.TELEGRAM_REPORT_CHAT_ID, 'sabar gan...')
      }
    })
  } catch (err) {
    console.error(err)
  }
}

// ctx.reply(listUserMsg.join('\n') || 'Belum ada yang login', {
//   reply_to_message_id: ctx.message.message_id
// })
// schedule get weather
cron.schedule('1 0 * * *', async () => {
  try {
    await getWeather()
  } catch (err) {
    console.error(err)
  }
})

// schedule to reset data
cron.schedule('1 0 * * *', async () => {
  try {
    await ABSENSI.deleteMany()

    bot.telegram.sendMessage(process.env.TELEGRAM_REPORT_CHAT_ID, 'Data telah atur ulang')
  } catch (err) {
    console.error(err)
  }
})

const COMMANDS = [
  'login',
  'afk',
  'back',
  'logout',
  'cuaca',
  'mataelang'
]

;(async () => {
  const stickers = await STICKER.find()

  // get me
  const me = await bot.telegram.getMe()

  const STICKERSET_TITLE = process.env.STICKERSET_TITLE
  const STICKERSET_NAME = STICKERSET_TITLE.replace(/\s+/g, '').toLowerCase().trim() + '_by_' + me.username
  const STICKERSET_OWNER_ID = process.env.STICKERSET_OWNER_ID
  const STICKERSET_DEFAULT_IMAGE = process.env.STICKERSET_DEFAULT_IMAGE

  let GLOBAL_STICKERSET = null

  try {
    // check stickerset
    try {
      GLOBAL_STICKERSET = await bot.telegram.getStickerSet(STICKERSET_NAME)
    } catch (err) {
      GLOBAL_STICKERSET = false
    }

    // console.log(JSON.stringify(GLOBAL_STICKERSET, null, 2))

    // init sticker
    if (!GLOBAL_STICKERSET) {
      const res = await bot.telegram.createNewStickerSet(
        STICKERSET_OWNER_ID,
        STICKERSET_NAME,
        STICKERSET_TITLE,
        {
          emojis: '👋',
          png_sticker: Input.fromURL(STICKERSET_DEFAULT_IMAGE)
        }
      )
      if (!res) {
        console.log('failed to init stickerset')
      }
    }
  } catch (error) {
    console.log('failed to init stickerset: ', error)
  }

  const cuaca = async (ctx) => {
    try {
      await getWeather()
    } catch (err) {
      console.error(err)
    }
  }

  const mataelang = async (ctx) => {
    try {
      await getCaptureFileName()
    } catch (err) {
      console.error(err)
    }
  }

  const login = async (ctx) => {
    const from = '@' + ctx.from.username
    const when = `Online sejak ${now().format('HH:mm:ss')}`
    if (from === '@undefined') {
      ctx.reply('Set username telegram dulu kak!', {
        reply_to_message_id: ctx.message.message_id
      })
      return
    }

    await ABSENSI.findOneAndUpdate(
      { telegram_user: from },
      {
        $set: {
          online_status: when,
          is_online: true,
          is_afk: false,
          afk_status: ''
        }
      },
      { upsert: true, new: true }
    )
    ctx.reply('Ok', {
      reply_to_message_id: ctx.message.message_id
    })
  }

  const afk = async (ctx) => {
    const from = '@' + ctx.from.username
    const when = `Afk sejak ${now().format('HH:mm:ss')}`

    const message = ctx.message.text || ''
    const messageSplitted = message.split(' ')
    const afkReason = message.replace(messageSplitted[0], '').trim()

    const Data = await ABSENSI.findOne({
      telegram_user: from
    })

    if (!Data) {
      return
    }

    if (Data.is_online === false) {
      ctx.reply('Anda belum login cuy!', {
        reply_to_message_id: ctx.message.message_id
      })
    } else {
      await ABSENSI.findOneAndUpdate(
        { telegram_user: from },
        { $set: { online_status: when, is_afk: true, afk_status: afkReason } },
        { upsert: true, new: true }
      )
      ctx.reply('Ok', {
        reply_to_message_id: ctx.message.message_id
      })
    }
  }

  const logout = async (ctx) => {
    const from = '@' + ctx.from.username
    const when = `Logout sejak ${now().format('HH:mm:ss')}`
    const Data = await ABSENSI.findOne({
      telegram_user: from
    })
    if (!Data) {
      return
    }
    if (Data.is_online === false) {
      ctx.reply('Gabisa logout kak, Anda belum login!', {
        reply_to_message_id: ctx.message.message_id
      })
    } else {
      await ABSENSI.findOneAndUpdate(
        { telegram_user: from },
        { $set: { online_status: when, is_online: false, afk_status: '' } },
        { upsert: true, new: true }
      )
      ctx.reply('Ok', {
        reply_to_message_id: ctx.message.message_id
      })
    }
  }

  bot.command('/addsticker', async (ctx) => {
    if (!ctx.message.reply_to_message || (!ctx.message.reply_to_message.document && !ctx.message.reply_to_message.sticker)) {
      return
    }

    const message = ctx.message.text || ''
    const messageSplitted = message.split(' ')
    const emojiRaw = message.replace(messageSplitted[0], '').trim()
    // /addsticker 😾,👎
    if (emojiRaw.length < 2) {
      ctx.reply('emoji cok', {
        reply_to_message_id: ctx.message.message_id
      })
      return
    }

    const emojis = emojiRaw.split(',')

    const fileID = ctx.message.reply_to_message?.document?.file_id ?? ctx.message.reply_to_message?.sticker?.file_id
    const fileUniqueID = ctx.message.reply_to_message?.document?.file_unique_id ?? ctx.message.reply_to_message?.sticker?.file_unique_id

    try {
      // check sticker exist
      const fileExist = await STICKEROWNER.findOne({
        sticker_original_id: fileUniqueID
      })

      if (fileExist) {
        ctx.reply('sticker syudah ada', {
          reply_to_message_id: ctx.message.message_id
        })
        return
      }

      await ctx.telegram.addStickerToSet(
        STICKERSET_OWNER_ID,
        STICKERSET_NAME,
        {
          emojis: emojis.join(','),
          png_sticker: Input.fromFileId(fileID)
        }
      )

      // get real sticker file id
      GLOBAL_STICKERSET = await ctx.telegram.getStickerSet(STICKERSET_NAME)

      // add to sticker owner
      STICKEROWNER.create({
        username: ctx.message.from.username,
        emojis,
        sticker_original_id: fileUniqueID,
        sticker_id: GLOBAL_STICKERSET.stickers[GLOBAL_STICKERSET.stickers.length - 1].file_id
      })

      ctx.reply('sticker added', {
        reply_to_message_id: ctx.message.message_id
      })
    } catch (err) {
      ctx.reply(`failed to add sticker: ${err.message}`, {
        reply_to_message_id: ctx.message.message_id
      })
    }
  })

  bot.command('/delsticker', async (ctx) => {
    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.sticker) {
      return
    }

    const fileID = ctx.message.reply_to_message.sticker.file_id
    // const username = ctx.message.from.username ?? ''

    // ctx.reply(JSON.stringify(ctx.message.reply_to_message, null, 2))
    // return

    try {
      // check from stikcer owner
      // const owner = await STICKEROWNER.findOne({
      //   username,
      //   sticker_original_id: fileID
      // })

      // if (!owner) {
      //   ctx.reply('sek gawe sopo sek mbusak sopo', {
      //     reply_to_message_id: ctx.message.message_id
      //   })
      //   return
      // }

      await ctx.telegram.deleteStickerFromSet(fileID)

      // await STICKEROWNER.findByIdAndDelete(owner.id)

      ctx.reply('sticker removed from set. it may take a while to update', {
        reply_to_message_id: ctx.message.message_id
      })
    } catch (err) {
      ctx.reply('failed to removed sticker from set. maybe it has been deleted', {
        reply_to_message_id: ctx.message.message_id
      })
    }
  })

  bot.command('/stickers', async (ctx) => {
    ctx.reply(`https://t.me/addstickers/${STICKERSET_NAME}`, {
      reply_to_message_id: ctx.message.message_id
    })
  })

  // bot
  bot.on(message('sticker'), (ctx) => {
    // console.log(ctx.message.sticker.file_unique_id)
    if (stickers.filter(s => s.command === 'login').map(v => v.file_id).includes(ctx.message.sticker.file_unique_id)) {
      login(ctx)
    } else if (stickers.filter(s => s.command === 'afk').map(v => v.file_id).includes(ctx.message.sticker.file_unique_id)) {
      afk(ctx)
    } else if (stickers.filter(s => s.command === 'back').map(v => v.file_id).includes(ctx.message.sticker.file_unique_id)) {
      login(ctx)
    } else if (stickers.filter(s => s.command === 'logout').map(v => v.file_id).includes(ctx.message.sticker.file_unique_id)) {
      logout(ctx)
    }
  })

  bot.command('start', (ctx) => {
    ctx.reply('Haii, selamat datang di bot login!')
  })
  bot.command('login', login)

  bot.command('logout', logout)

  bot.command('afk', afk)

  bot.command('back', login)

  bot.command('cuaca', cuaca)

  bot.command('mataelang', mataelang)

  bot.command('list', async (ctx) => {
    const users = await ABSENSI.find()
    const listUserMsg = []
    for (const user of users) {
      listUserMsg.push(`${user.telegram_user} ${user.online_status} ${user.afk_status !== '' ? `lagi ${user.afk_status}` : ''}`)
    }
    ctx.reply(listUserMsg.join('\n') || 'Belum ada yang login', {
      reply_to_message_id: ctx.message.message_id
    })
  })

  // bot.command('ping', async (ctx) => {
  //   const message = ctx.message.text
  //   const messageSplitted = message.split(' ')
  //   const status = messageSplitted[1]

  //   const Data = await ABSENSI.findOne({
  //     telegram_user: status
  //   })
  //   if (Data) {
  //     if (Data.is_afk) {
  //       ctx.reply(
  //         `${Data.telegram_user}, ${Data.online_status} ${
  //           Data.afk_status !== '' ? `, ${Data.afk_status}` : ''
  //         }`
  //       )
  //     } else if (Data.is_online) {
  //       ctx.reply('Halo ' + Data.telegram_user + ', ' + Data.online_status)
  //     } else if (Data) {
  //       ctx.reply(Data.telegram_user + ', ' + Data.online_status)
  //     } else {
  //       ctx.reply(status + ' tidak ada')
  //     }
  //   } else {
  //     ctx.reply(status + ' tidak ada')
  //   }
  // })

  bot.command('makeitas', async (ctx) => {
    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.sticker) {
      return
    }

    const message = ctx.message.text || ''
    const messageSplitted = message.split(' ')
    const command = (messageSplitted[1] ?? '').trim()

    // only defined command(s) available
    if (!COMMANDS.includes(command)) {
      ctx.reply(`command ${command} tidak tersedia`)
      return
    }

    const stickerFileId = ctx.message.reply_to_message.sticker.file_unique_id

    // check sticker is defined
    if (stickers.find(s => s.file_id === stickerFileId)) {
      ctx.reply('sticker sudah terpakai')
      return
    }

    // add to collection
    await STICKER.create({
      file_id: stickerFileId,
      command,
      assigner: `@${ctx.from.username}`
    })

    // add to variable
    stickers.push({
      file_id: stickerFileId,
      command,
      assigner: `@${ctx.from.username}`
    })

    ctx.reply(`sticker berhasil ditambahkan ke /${command}`)
  })

  bot.on(message('text'), async (ctx) => {
    const msg = ctx.message.text

    const taggedUsernames = getUsernamesAndBody(msg)

    if (taggedUsernames.length > 0) {
      const taggedUsers = await ABSENSI.find({
        telegram_user: {
          $in: taggedUsernames
        }
      })

      const usersMesages = []

      for (let i = 0; i < taggedUsers.length; i++) {
        const user = taggedUsers[i]
        if (user.is_afk) {
          usersMesages.push(
            `${user.telegram_user} ${
              user.afk_status !== '' ? `lagi ${user.afk_status}` : ''
            }`
          )
        }
      }

      if (usersMesages.length > 0) {
        ctx.reply(`kayane bocah iki lagi afk \n${usersMesages.join('\n')}`)
      }
    }
  })

  bot.launch()
})()
