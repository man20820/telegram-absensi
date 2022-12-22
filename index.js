require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const res = require("express/lib/response");

const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const dayjs = require('dayjs')
var timezone = require('dayjs/plugin/timezone')
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)
const tz = "Asia/Jakarta"
dayjs.extend(timezone)


//mongodb connection
const connection = mongoose.connection;
connection.on("error", console.log.bind(console, "connection error: "));
connection.once("open", () => {
  console.log("mongodb success");
});
const uri = process.env.MONGO_URI || $MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
});
const Schema = mongoose.Schema;
const absensiSchema = new Schema({
  telegram_user: String,
  online_status: String,
  afk_status: String,
  is_online: String,
  is_afk: String,
});
const ABSENSI = mongoose.model("ABSENSI", absensiSchema);

// //basic configuration
// const port = process.env.PORT || $PORT;

// app.use(cors());
// app.use(bodyParser.json());

// app.route("/").get((req, res) => {
//     res.send("info man@tkjpedia.com");
//   });

console.log(dayjs().hour() + ":" + dayjs().minute() + ":" + dayjs().second())

// bot
bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Haii, selamat datang di bot absensi!', {
    })
})
bot.command('login',async (ctx) => {
    console.log(ctx.from)
    let from = "@" + ctx.from["username"]
    let when = "Login sejak " + dayjs().hour() + ":" + dayjs().minute() + ":" + dayjs().second()
    let message = ctx.message.text
    let messageSplitted = message.split(' ')
    let status = messageSplitted[1]
    console.log(from)
    console.log(when)
    console.log(status)
    ctx.reply('Ok')
    const Data = await ABSENSI.findOneAndUpdate(
        { telegram_user: from },
        { $set: { online_status: when, is_online: "1", is_afk: "1" } },
        { upsert: true, new: true }
      );
    Data.telegram_user
    Data.online_status
});

bot.command('logout',async (ctx) => {
    console.log(ctx.from)
    let from = "@" + ctx.from["username"]
    let when = "Logout sejak " + dayjs().hour() + ":" + dayjs().minute() + ":" + dayjs().second()
    let message = ctx.message.text
    let messageSplitted = message.split(' ')
    let status = messageSplitted[1]
    console.log(from)
    console.log(when)
    console.log(status)
    ctx.reply('Ok')
    const Data = await ABSENSI.findOneAndUpdate(
        { telegram_user: from },
        { $set: { online_status: when, is_online: "0" } },
        { upsert: true, new: true }
      );
    Data.telegram_user
    Data.online_status
});

bot.command('afk',async (ctx) => {
    console.log(ctx.from)
    let from = "@" + ctx.from["username"]
    let when = "Afk sejak " + dayjs().hour() + ":" + dayjs().minute() + ":" + dayjs().second()
    let message = ctx.message.text
    let messageSplitted = message.split(' ')
    let status = messageSplitted[1]
    console.log(from)
    console.log(when)
    console.log(status)
    ctx.reply('Ok')
    const Data = await ABSENSI.findOneAndUpdate(
        { telegram_user: from },
        { $set: { online_status: when, is_afk:"1", afk_status: status } },
        { upsert: true, new: true }
      );
    Data.telegram_user
    Data.online_status
    Data.afk_status
});

bot.command('back',async (ctx) => {
  console.log(ctx.from)
  let from = "@" + ctx.from["username"]
  let when = "Online sejak " + dayjs().hour() + ":" + dayjs().minute() + ":" + dayjs().second()
  let message = ctx.message.text
  let messageSplitted = message.split(' ')
  let status = messageSplitted[1]
  console.log(from)
  console.log(when)
  console.log(status)
  ctx.reply('Ok')
  const Data = await ABSENSI.findOneAndUpdate(
      { telegram_user: from },
      { $set: { online_status: when, is_afk:"0", afk_status: status } },
      { upsert: true, new: true }
    );
  Data.telegram_user
  Data.online_status
  Data.afk_status
});

bot.command('ping',async (ctx) => {
  console.log(ctx.from)
  let message = ctx.message.text
  let messageSplitted = message.split(' ')
  let status = messageSplitted[1]
  // console.log(from)
  // console.log(status)
  let Data = await ABSENSI.findOne({
    telegram_user: status,
  });
  if (Data) {
    if (Data.is_online == 1) {
      ctx.reply("Halo " + Data.telegram_user + ", " + Data.online_status)
    } else if (Data.is_afk == 1) {
      ctx.reply(Data.telegram_user + ", " + Data.online_status + Data.afk_status)
    } else if (Data) {
      ctx.reply(Data.telegram_user + ", " + Data.online_status)
    } else {
      ctx.reply(status + " tidak ada")
    }
  } else {
    ctx.reply(status + " tidak ada")
  }

});

bot.launch();


//listen
// app.listen(port);