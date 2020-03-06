const ListingModel = require('../models/ListingModel')

/**
 * Shows listings with pagination.
 *
 * Uses GET parameters "limit" and "page" to list only
 * "limit" amount of results per page. However, they aren't
 * necessary because they have defaults. Response holds
 * props "next" & "prev" for easy navigation in frontend.
 */
exports.read = async (req, res) => {
  let { limit = 10, page = 0 } = req.query
  limit = parseInt(limit)
  page = parseInt(page)

  try {
    const numberOfListings = await ListingModel.estimatedDocumentCount()
    const listings = await ListingModel.find()
      .sort({ createdAt: 'asc' })
      .skip(limit * page)
      .limit(limit)

    const baseURL = `${req.protocol}://${req.get('host')}/listings?limit=${limit}`
    const nextPageIsEmpty = numberOfListings < limit * (page + 1)
    const onFirstPage = (page - 1) < 0

    res.json({
      count: numberOfListings,
      next: nextPageIsEmpty ? null : `${baseURL}&page=${page + 1}`,
      prev: onFirstPage ? null : `${baseURL}&page=${page - 1}`,
      data: listings
    })
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
}

exports.readById = async (req, res) => {
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
}

exports.create = async (req, res) => {
  const listing = new ListingModel(req.body)

  try {
    const result = await listing.save()
    res.status(201).json(result)
  } catch (error) {
    res
      .status(error.name === 'ValidationError' ? 422 : 500)
      .json(error)
  }
}

exports.update = async (req, res) => {
  const _id = req.params.id

  try {
    const result = await ListingModel.updateOne({ _id }, req.body)

    if (result.ok) {
      const updatedDocument = await ListingModel.findById(_id)
      res.json(updatedDocument)
    } else {
      res.json(result) // what case? status?
    }
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
}

exports.remove = async (req, res) => {
  const _id = req.params.id

  try {
    const result = await ListingModel.remove({ _id })
    if (!result) res.sendStatus(404)
    res.json(result)
  } catch (error) {
    res.status(500).json(error)
  }
}
