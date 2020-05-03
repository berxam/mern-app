const { resolve } = require('path')
const { cwebp } = require('webp-converter')
const router = require('express').Router()

const UPLOADS_DIR = resolve(__dirname, '../../uploads')
// Set up multer middleware for uploading files
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resolve(UPLOADS_DIR, './tmp'))
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage })

const ListingModel = require('../models/ListingModel')

const paginateModel = async (model, req, res, filter = null, select = null) => {
  // Returns an integer if n is between min and max (inclusive), false otherwise
  const isNumBetween = (n, min, max) => {
    const int = parseInt(n)
    return !isNaN(int) && n >= min && n <= max && int
  }
  const page = isNumBetween(req.query.page, 0, Infinity) || 0
  const options = {
    limit: isNumBetween(req.query.limit, 1, 100) || 20,
    sort: { createdAt: 'asc' }
  }

  options.skip = options.limit * page

  try {
    let numberOfDocuments, documents
    if (filter) {
      numberOfDocuments = await model.countDocuments(filter)
      documents = await model.find({}, select, options)
    } else {
      numberOfDocuments = await model.estimatedDocumentCount()
      documents = await model.find({}, select, options)
    }

    const baseUrl = `${req.fullUrl}?limit=${options.limit}`
    const nextPageIsEmpty = numberOfDocuments < options.limit * (page + 1)

    res.json({
      count: numberOfDocuments,
      next: nextPageIsEmpty ? null : `${baseUrl}&page=${page + 1}`,
      prev: page <= 0 ? null : `${baseUrl}&page=${page - 1}`,
      data: documents
    })
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
}

router.get('/', async (req, res) => {
  if (req.query.by) {
    paginateModel(ListingModel, req, res, { userId: req.query.by })
  } else {
    paginateModel(ListingModel, req, res)
  }
})

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

router.post('/', upload.array('pics', 10), async (req, res) => {
  if (req.files) {
    const images = []
    req.files.forEach(file => {
      const { filename, path } = file
      const pos = filename.lastIndexOf('.')
      const newName = filename.substr(0, pos < 0 ? filename.length : pos) + '.webp'
      const dest = resolve(UPLOADS_DIR, newName)

      images.push(new Promise((resolve, reject) => {
        cwebp(path, dest, '-q 70', (status, error) => {
          resolve(`${req.protocol}://${
            req.get('host') + '/uploads/' + newName
          }`)
        })
      }))
    })
    req.body.images = await Promise.all(images)
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

router.put('/:id', async (req, res) => {
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
})

router.delete('/:id', async (req, res) => {
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
