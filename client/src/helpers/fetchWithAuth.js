import getUser from './getUser'

/**
 * Fetches URL with credentials of user found in localStorage.
 * 
 * @param {String} url URL to fetch.
 * @param {Object} init Options for request, merged with auth options.
 * @returns {Promise} HTTP response
 */
export default (url, init = null) => {
  const user = getUser()
  let options = {
    credentials: 'include',
    headers: {
      authorization: `Bearer ${user.accessToken}`
    }
  }

  if (init !== null) {
    const { headers, ...rest } = init
    
    if (headers) {
      options.headers = { ...options.headers, ...headers }
    }

    options = { ...options, ...rest }
  }

  return fetch(url, options)
}
