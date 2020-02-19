// Require ListingModel
const ListingModel = require('../models/ListingModel')

const readAll = async (req, res) => {
  try {
    const result = await ListingModel.find()
    if (!result) res.sendStatus(404)
    res.json(result)
  } catch (error) {
    res.status(500).json(error)
  }
}

const readById = async (req, res) => {
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

const create = async (req, res) => {
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

const update = async (req, res) => {
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

const remove = async (req, res) => {
  const _id = req.params.id

  try {
    const result = await ListingModel.remove({ _id })
    if (!result) res.sendStatus(404)
    res.json(result)
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports = { readAll, readById, create, update, remove }
