const jwt = require('jsonwebtoken')

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    console.log(
      '[auth-middleware]',
      'Was expecting authorization header like "Bearer TOKEN"',
      `but got: ${authHeader}`
    )
    return res.sendStatus(401)
  }

  console.log(
    '[auth-middleware]',
    'Got authorization header with bearer token. Trying to verify...'
  )

  try {
    const user = jwt.verify(token, process.env.ACCESS_SECRET)
    console.log('[auth-middleware]', 'Verified! Storing user to request.')
    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('[auth-middleware]', 'Token is expired!')
    } else {
      console.log('[auth-middleware]', err)
    }

    res.sendStatus(403)
  }
}

exports.cookieAuth = async (req, res, next) => {
  const token = req.cookies.jid

  if (!token) {
    console.log('[auth-middleware]', 'Was expecting cookie')
    return res.sendStatus(401)
  }

  console.log(
    '[auth-middleware]',
    'Got token from cookie. Trying to verify...'
  )

  try {
    const user = jwt.verify(token, process.env.REFRESH_SECRET)
    console.log('[auth-middleware]', 'Verified! Storing user to request.')
    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('[auth-middleware]', 'Token is expired!')
    } else {
      console.log('[auth-middleware]', err)
    }

    res.sendStatus(403)
  }
}
