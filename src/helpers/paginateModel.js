const { objectIsEmpty, getObjectFields } = require('./objects')

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
    let { page, limit, sortBy, asc = false, searchString, ...queryFilters } = req.query

    const options = {
      limit: isNumBetween(limit, 1, 100) || 20,
      sort: sortBy && exposedSortingFields.includes(sortBy)
        ? { [sortBy]: asc ? 'asc' : 'desc' }
        : { createdAt: asc ? 'asc' : 'desc' }
    }

    page = isNumBetween(page, 0, Infinity) || 0
    options.skip = options.limit * page

    try {
      const baseUrl = new URL(req.fullUrl)
      let numberOfDocuments, documents

      if (searchString && searchString !== '') {
        numberOfDocuments = await model.countDocuments({ $text: { $search: searchString } })
        documents = await model.find({ $text: { $search: searchString } }, select, options)
      } else if (exposedFilters && queryFilters) {
        const actualFilters = getObjectFields(queryFilters, exposedFilters)

        if (!objectIsEmpty(actualFilters)) {
          numberOfDocuments = await model.countDocuments(actualFilters)
          documents = await model.find(actualFilters, select, options)
          Array.prototype.forEach.call(actualFilters, (val, key) => {
            baseUrl.searchParams.append(key, val)
          })
        }
      }

      if (numberOfDocuments === undefined && documents === undefined) {
        numberOfDocuments = await model.estimatedDocumentCount()
        documents = await model.find({}, select, options)
      }

      const nextPageIsEmpty = numberOfDocuments < options.limit * (page + 1)
      baseUrl.searchParams.append('limit', options.limit)
      baseUrl.searchParams.append('sortBy', Object.keys(options.sort)[0])
      baseUrl.searchParams.append('asc', asc)

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
