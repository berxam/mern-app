const router = require('express').Router()

const { upload, saveImages } = require('../middleware/upload')
const { authenticate } = require('../middleware/auth')

const ListingModel = require('../models/ListingModel')
const paginateModel = require('../helpers/paginateModel')
const ROLES = require('../helpers/roles')

router.get('/', paginateModel(ListingModel, null, 'creatorId', 'createdAt'))

router.get('/:id', async (req, res) => {
  try {
    const result = await ListingModel.findById(req.params.id)
    res.json(result)
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        res.sendStatus(404)
        break
      default:
        res.status(500).json(error)
    }
  }
})

router.post('/', authenticate(ROLES.BASIC), upload.array('pics', 10), async (req, res) => {
  if (req.files) {
    try {
      req.body.images = await saveImages(req.files, req.realBaseUrl)
    } catch (error) {
      return res.sendStatus(500)
    }
  }

  const listing = new ListingModel(req.body)

  try {
    const result = await listing.save()
    res.status(201).json(result)
  } catch (error) {
    res
      .status(error.name === 'ValidationError' ? 422 : 500)
      .json(error)
  }
})

// For updating listing values other than `offers`
// TO DO: CHECK THAT THE UPDATER IS THE CREATOR OF THE DOCUMENT
router.put('/:id', authenticate(ROLES.BASIC), async (req, res) => {
  const _id = req.params.id

  try {
    const listing = await ListingModel.findOneAndUpdate({ _id }, req.body, { new: true })
    res.json(listing)
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        res.sendStatus(404)
        break
      case 'ValidationError':
        res.status(422).json(error)
        break
      default:
        res.status(500).json(error)
    }
  }
})

// For making an offer to a listing
router.post('/:id/offer', authenticate(ROLES.BASIC), async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.id)

    listing.offers.push({
      creatorId: req.user.id,
      creatorListingId: req.body.creatorListingId
    })

    await listing.save()
    res.sendStatus(201)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

// Accepting/rejecting offers
// TO DO: CHECK THAT THE UPDATER IS THE CREATOR OF THE DOCUMENT
router.put('/:id/offers/:offerId', authenticate(ROLES.BASIC), async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.id)
    const offer = listing.offers.id(req.params.offerId)
    offer.accepted = req.body.accepted
    await listing.save()
    res.sendStatus(204)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

// TO DO: CHECK THAT THE UPDATER IS THE CREATOR OF THE DOCUMENT
router.delete('/:id', authenticate(ROLES.BASIC), async (req, res) => {
  const _id = req.params.id

  try {
    const result = await ListingModel.remove({ _id })
    if (!result) res.sendStatus(404)
    res.json(result)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
