const router = require('express').Router()
const listing = require('../controllers/ListingControl')

router.get('/', listing.readAll)
router.get('/:id', listing.readById)
router.post('/', listing.create)
router.put('/:id', listing.update)
router.delete('/:id', listing.remove)

module.exports = router
