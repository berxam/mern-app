const ListingModel = require('../models/ListingModel')
const ROLES = require('../helpers/roles')

/**
 * Ensures that a listing with the ID of req.params[`field`] is
 * created by the user in `req.user`, or that `req.user` is an admin
 * and if so, attaches the listing to the request (req.listing), otherwise sends 403.
 */
module.exports = (field = 'id') => {
  return async (req, res, next) => {
    const userId = req.user.id
    const listingId = req.params[field]

    if ((userId && listingId) || req.user.role === ROLES.ADMIN) {
      try {
        const listing = await ListingModel.findById(listingId)

        if (listing.creatorId === userId) {
          req.listing = listing
          return next()
        }
      } catch (error) {
        return res.sendStatus(500)
      }
    }

    return res.sendStatus(403)
  }
}
