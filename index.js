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
    let from = ctx.from["first_name"]
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
        { $set: { online_status: when } },
        { upsert: true, new: true }
      );
    Data.telegram_user
    Data.online_status
});

bot.command('logout',async (ctx) => {
    console.log(ctx.from)
    let from = ctx.from["first_name"]
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
        { $set: { online_status: when } },
        { upsert: true, new: true }
      );
    Data.telegram_user
    Data.online_status
});

bot.command('afk',async (ctx) => {
    console.log(ctx.from)
    let from = ctx.from["first_name"]
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
        { $set: { online_status: when, afk_status: status } },
        { upsert: true, new: true }
      );
    Data.telegram_user
    Data.online_status
    Data.afk_status
});

let anu = "*"
bot.hears(anu, (ctx) => ctx.reply('Hey there'));

bot.launch();


//listen
// app.listen(port);