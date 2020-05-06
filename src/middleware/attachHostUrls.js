/**
 * Attaches a `realBaseUrl` and a `fullUrl` to the request.
 *
 * @example
 *   req.realBaseUrl // http://localhost:5000
 *   req.fullUrl     // http://localhost:5000/listings/idhere
 */
module.exports = (req, res, next) => {
  req.realBaseUrl = `${req.protocol}://${req.get('host')}`
  req.fullUrl = req.realBaseUrl + req.baseUrl + req.path
  next()
}
