require('dotenv').config()
const mongoose = require('mongoose')
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const { getUsernamesAndBody, now } = require('./helper')
const cron = require('node-cron')

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

// bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

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
  'logout'
]

;(async () => {
  const stickers = await STICKER.find()

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
