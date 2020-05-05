/**
 * Returns an integer if n is between min and max (inclusive), false otherwise.
 *
 * @param {Number} n Number to check.
 * @param {Number} min Minimum value.
 * @param {Number} max Maximum value.
 * @returns {Integer|Boolean} Number or false
 */
const isNumBetween = (n, min, max) => {
  const int = parseInt(n)
  return !isNaN(int) && n >= min && n <= max && int
}

const objectIsEmpty = (object) => {
  for (const prop in object) {
    if (Object.prototype.hasOwnProperty.call(object, prop)) {
      return false
    }
  }

  return true
}

/**
 * Copies specified fields from an object.
 *
 * @param {Object} object Object from which to get key/value-pairs.
 * @param {String} fields Space-separated list of field names (keys).
 * @returns {Object} Object with all wanted keys that had values.
 */
const getObjectFields = (object, fields) => {
  const gottenFields = {}

  for (const key in object) {
    if (object[key] !== undefined && fields.includes(key)) {
      gottenFields[key] = object[key]
    }
  }

  return gottenFields
}

/**
 * Creates a pagination route for Mongoose & Express.
 *
 * Routes created are accessible with no parameters, but you can add
 * `page`, `limit`, `sortBy`, `asc` and filter parameters.
 *
 * @param model Mongoose model
 * @param {String} select Space separated list of fields you want to expose
 * @param {String} exposedFilters Filtering fields you want to expose
 * @param {String} exposedSortingFields Sorting fields you want to expose
 *
 * @example
 * app.get('/books', paginate(BookModel, 'title author', 'author category', 'createdAt'))
 */
module.exports = (model, select = null, exposedFilters = null, exposedSortingFields = null) => {
  return async (req, res) => {
    let { page, limit, sortBy, asc = false, ...queryFilters } = req.query

    const options = {
      limit: isNumBetween(limit, 1, 100) || 20,
      sort: exposedSortingFields.includes(sortBy)
        ? { [sortBy]: asc ? 'asc' : 'desc' }
        : { createdAt: 'desc' }
    }

    page = isNumBetween(page, 0, Infinity) || 0
    options.skip = options.limit * page

    try {
      let numberOfDocuments, documents

      if (exposedFilters && queryFilters) {
        const actualFilters = getObjectFields(queryFilters, exposedFilters)

        if (!objectIsEmpty(actualFilters)) {
          numberOfDocuments = await model.countDocuments(actualFilters)
          documents = await model.find(actualFilters, select, options)
        }
      }

      if (numberOfDocuments === undefined && documents === undefined) {
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
}
