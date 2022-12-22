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
module.exports = mongoose.model('ABSENSI', absensiSchema)
