const { Schema, model } = require('mongoose')

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  keywords: Array,
  img: String
}, {
  timestamps: { createdAt: true }
})

module.exports = model('listing', ListingSchema)
