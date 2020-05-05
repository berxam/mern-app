/**
 * Creates a URL from endpoint and adds GET parameters.
 * 
 * @param {String} endpoint URL or URI, if no host is supplied, uses `http://localhost:5000`
 * @param {Object} params HTTP GET parameters to add to the URL.
 * @returns {URL} Created URL object
 */
export default (endpoint, params = {}) => {
  const url = new URL(endpoint, 'http://localhost:5000')

  for (const key in params) {
    url.searchParams.append(key, params[key])
  }

  return url
}
