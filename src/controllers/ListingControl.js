// Require ListingModel
const ListingModel = require('../models/ListingModel')

module.exports = {
  readAll: async (req, res) => {
    try {
      const result = await ListingModel.find()
      if (!result) res.sendStatus(404)
      res.json(result)
    } catch (error) {
      res.status(500).json({ error })
    }
  },

  readById: async (req, res) => {
    try {
      const result = await ListingModel.find()
      if (!result) res.sendStatus(404)
      res.json(result)
    } catch (error) {
      res.status(500).json({ error })
    }
  },

  create: async (req, res) => {
    const listing = new ListingModel({
      title: req.body.title,
      url: req.body.url,
      category: req.body.category,
      img: req.body.img
    })

    try {
      const result = await listing.save()
      res.status(201).json(result)
    } catch (error) {
      res.status(500).json({ error })
    }
  },

  update: async (req, res) => {
    const _id = req.params.id

    try {
      const result = await ListingModel.updateOne({ _id }, req.body)
      if (!result) res.sendStatus(404)
      res.json(result)
    } catch (error) {
      res.status(500).json({ error })
    }
  },

  delete: async (req, res) => {
    const _id = req.params.id

    try {
      const result = await ListingModel.remove({ _id })
      if (!result) res.sendStatus(404)
      res.json(result)
    } catch (error) {
      res.status(500).json({ error })
    }
  }
}
