const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  keywords: Array,
  img: String
})

module.exports = mongoose.model('listing', ListingSchema)
