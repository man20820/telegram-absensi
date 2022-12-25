const mongoose = require('mongoose')

const stickerSchema = new mongoose.Schema({
  file_id: String,
  command: String,
  assigner: String
})

module.exports = mongoose.model('STICKER', stickerSchema)
