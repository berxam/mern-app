const { Schema, model } = require('mongoose')

const RefreshTokenSchema = new Schema({
  token: String,
  isValid: Boolean
})

module.exports = model('tokens', RefreshTokenSchema)
