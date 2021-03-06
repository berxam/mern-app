const jwt = require('jsonwebtoken')

exports.ensureUserId = (field = 'id') => {
  return (req, res, next) => {
    if (req.user.id && req.params[field] && req.user.id === req.params[field]) {
      next()
    } else {
      return res.sendStatus(403)
    }
  }
}

// Used for SSE
exports.cookieAuth = (req, res, next) => {
  const token = req.cookies.jid

  if (!token) return res.sendStatus(401)

  try {
    const user = jwt.verify(token, process.env.REFRESH_SECRET)
    req.user = user
    next()
  } catch (err) {
    res.sendStatus(403)
  }
}

exports.authenticate = (role) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)

    try {
      const user = jwt.verify(token, process.env.ACCESS_SECRET)
      if (!user.role || user.role < role) throw new Error('Role missing or smaller than needed')
      console.log('rooli verifioitu')
      req.user = user
      next()
    } catch (err) {
      console.log(err)
      res.sendStatus(403)
    }
  }
}
