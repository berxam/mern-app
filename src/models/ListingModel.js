const { Schema, model } = require('mongoose')

const UserModel = require('./UserModel')

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

OfferSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const listing = this.parent()
      const offerReceiver = await UserModel.findById(listing.creatorId)
      const offerSender = await UserModel.findById(this.creatorId)

      offerReceiver.notifications.push({
        title: `${offerSender.username} made an offer for ${listing.title}`,
        listingId: listing._id
      })

      await offerReceiver.save()
    } catch (error) {
      console.log(error)
    }
  }

  next()
})

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  keywords: [String],
  images: [String],
  creatorId: String,
  offers: [OfferSchema]
}, {
  timestamps: { createdAt: true }
})

module.exports = model('listing', ListingSchema)
