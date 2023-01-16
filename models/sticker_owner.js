const mongoose = require('mongoose')

const stickerOwneSchema = new mongoose.Schema({
  username: String,
  emojis: [String],
  sticker_original_id: String,
  sticker_id: String
}, {
  collection: 'sticker_owners'
})

module.exports = mongoose.model('StickerOwner', stickerOwneSchema)
