require("dotenv").config();
const mongoose = require("mongoose");
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const { getUsernamesAndBody, now } = require("./helper");

// mongodb connection
const connection = mongoose.connection;
connection.on("error", (err) => console.error(err));
connection.once("open", () => {
  console.log("mongodb success");
});
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/absensi";
mongoose.set("strictQuery", false);
mongoose.connect(uri, {
  useNewUrlParser: true,
});

const ABSENSI = require("./model");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const sticker_login = ["AgADYwYAAoTUMFU", "AgADDAYAAhxW6Fc"];
const sticker_afk = ["AgAD6QYAAoRbMFU"];
const sticker_logout = ["AgADEgcAAlixMFU"];

let login = async (ctx) => {
  const from = "@" + ctx.from.username;
  const when = `Online sejak ${now().format("HH:mm:ss")}`;
  if (from == "@undefined") {
    ctx.reply("Set id telegram dulu kak!", {
      reply_to_message_id: ctx.message.message_id,
    });
  } else {
    await ABSENSI.findOneAndUpdate(
      { telegram_user: from },
      {
        $set: {
          online_status: when,
          is_online: true,
          is_afk: false,
          afk_status: "",
        },
      },
      { upsert: true, new: true }
    );
    ctx.reply("Ok", {
      reply_to_message_id: ctx.message.message_id,
    });
  }
};

let afk = async (ctx) => {
  const from = "@" + ctx.from.username;
  const when = `Afk sejak ${now().format("HH:mm:ss")}`;

  const message = ctx.message.text || "";
  const messageSplitted = message.split(" ");
  const afkReason = message.replace(messageSplitted[0], "").trim();

  const Data = await ABSENSI.findOne({
    telegram_user: from,
  });
  if (Data.is_online == false) {
    ctx.reply("Anda belum login cuy!", {
      reply_to_message_id: ctx.message.message_id,
    });
  } else {
    await ABSENSI.findOneAndUpdate(
      { telegram_user: from },
      { $set: { online_status: when, is_afk: true, afk_status: afkReason } },
      { upsert: true, new: true }
    );
    ctx.reply("Ok", {
      reply_to_message_id: ctx.message.message_id,
    });
  }
};

let logout = async (ctx) => {
  const from = "@" + ctx.from.username;
  const when = `Logout sejak ${now().format("HH:mm:ss")}`;
  const Data = await ABSENSI.findOne({
    telegram_user: from,
  });
  if (Data.is_online == false) {
    ctx.reply("Gabisa logout kak, Anda belum login!", {
      reply_to_message_id: ctx.message.message_id,
    });
  } else {
    await ABSENSI.findOneAndUpdate(
      { telegram_user: from },
      { $set: { online_status: when, is_online: false, afk_status: "" } },
      { upsert: true, new: true }
    );
    ctx.reply("Ok", {
      reply_to_message_id: ctx.message.message_id,
    });
  }
};

// bot
bot.on("sticker", (ctx) => {
  console.log(ctx.message.sticker.file_unique_id);
  if (sticker_login.includes(ctx.message.sticker.file_unique_id)) {
    login(ctx);
  } else if (sticker_afk.includes(ctx.message.sticker.file_unique_id)) {
    afk(ctx);
  } else if (sticker_logout.includes(ctx.message.sticker.file_unique_id)) {
    logout(ctx);
  } else {
    ctx.reply("Sticker anda salah!", {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});

bot.command("start", (ctx) => {
  ctx.reply("Haii, selamat datang di bot login!");
});
bot.command("login", async (ctx) => {
  login(ctx);
});

bot.command("logout", async (ctx) => {
  logout(ctx);
});

bot.command("afk", async (ctx) => {
  afk(ctx);
});

bot.command("back", async (ctx) => {
  login(ctx);
});

bot.command("list", async (ctx) => {
  ABSENSI.find({}, function (err, users) {
    let userMap = {};

    users.forEach(function (user) {
      userMap[user._id] = user;
    });
    listUser = [];
    for (index in userMap) {
      console.log(userMap[index]);
      listUser.push(
        `${userMap[index].telegram_user} ${userMap[index].online_status} ${
          userMap[index].afk_status !== ""
            ? `lagi ${userMap[index].afk_status}`
            : ""
        }`
      );
    }
    ctx.reply(listUser.join("\n"), {
      reply_to_message_id: ctx.message.message_id,
    });
  });
});

bot.command("ping", async (ctx) => {
  const message = ctx.message.text;
  const messageSplitted = message.split(" ");
  const status = messageSplitted[1];

  const Data = await ABSENSI.findOne({
    telegram_user: status,
  });
  if (Data) {
    if (Data.is_afk) {
      ctx.reply(
        `${Data.telegram_user}, ${Data.online_status} ${
          Data.afk_status !== "" ? `, ${Data.afk_status}` : ""
        }`
      );
    } else if (Data.is_online) {
      ctx.reply("Halo " + Data.telegram_user + ", " + Data.online_status);
    } else if (Data) {
      ctx.reply(Data.telegram_user + ", " + Data.online_status);
    } else {
      ctx.reply(status + " tidak ada");
    }
  } else {
    ctx.reply(status + " tidak ada");
  }
});

bot.on(message("text"), async (ctx) => {
  const msg = ctx.message.text;

  const taggedUsernames = getUsernamesAndBody(msg);

  if (taggedUsernames.length > 0) {
    const taggedUsers = await ABSENSI.find({
      telegram_user: {
        $in: taggedUsernames,
      },
    });

    const usersMesages = [];

    for (let i = 0; i < taggedUsers.length; i++) {
      const user = taggedUsers[i];
      if (user.is_afk) {
        usersMesages.push(
          `${user.telegram_user} ${
            user.afk_status !== "" ? `lagi ${user.afk_status}` : ""
          }`
        );
      }
    }

    if (usersMesages.length > 0) {
      ctx.reply(`kayane bocah iki lagi afk \n${usersMesages.join("\n")}`);
    }
  }
});

bot.launch();
