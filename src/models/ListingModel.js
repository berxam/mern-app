const { Schema, model } = require('mongoose')

const OfferSchema = new Schema({
  creatorId: String,
  creatorListingId: String,
  accepted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: true }
})

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  keywords: [String],
  images: [String],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  offers: [OfferSchema]
}, {
  timestamps: { createdAt: true }
})

module.exports = model('listing', ListingSchema)
