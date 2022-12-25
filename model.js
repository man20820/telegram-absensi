const mongoose = require('mongoose')

const absensiSchema = new mongoose.Schema({
  telegram_user: String,
  online_status: String,
  afk_status: {
    type: String,
    default: ''
  },
  is_online: Boolean,
  is_afk: Boolean
})

const stickerSchema = new mongoose.Schema({
  sticker_id: String,
  sticker_for: String
})

module.exports = mongoose.model('ABSENSI', absensiSchema, 'STICKER', stickerSchema)
