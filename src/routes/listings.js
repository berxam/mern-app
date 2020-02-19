const express = require('express')
const listingRouter = express.Router()

// Get listing controller
const listing = require('./controllers/User.js')

// Bind controller methods to routes
listingRouter.get('/', listing.readAll)
listingRouter.get('/:id', listing.readById)
listingRouter.post('/', listing.create)
listingRouter.put('/:id', listing.update)
listingRouter.delete('/:id', listing.delete)

module.exports = listingRouter
