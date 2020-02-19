const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ListingSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  keywords: {
    type: Array,
    required: true
  },
  img: String
})

module.exports = mongoose.model('listing', ListingSchema)
