const jwt = require('jsonwebtoken')
const router = require('express').Router()

const RefreshTokenModel = require('../models/RefreshTokenModel')
const UserModel = require('../models/UserModel')
const { authenticate } = require('../middleware/auth')

router.post('/register', async (req, res) => {
  const { email, username, password } = req.body

  console.log(req.body)

  if (!email || !username || !password) {
    return res.sendStatus(422)
  }

  const newUser = new UserModel({ email, username, password })

  try {
    await newUser.save()
    res.sendStatus(201)
  } catch (error) {
    res.status(400).json(error)
  }
})

// add remember me functionality!!!!
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await UserModel.findOne({ email })

  if (!user) {
    return res.sendStatus(404)
  }

  if (!await user.comparePassword(password)) {
    return res.sendStatus(401)
  }

  const payload = { id: user._id, username: user.username }
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' })
  const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: '15m' })

  await new RefreshTokenModel({ token: refreshToken, isValid: true })
    .save()

  res.cookie('jid', refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7d in ms
  })
  res.json({ accessToken })
})

router.get('/refresh', async (req, res) => {
  const refreshToken = req.cookies.jid

  if (!refreshToken) {
    console.log('[/auth/refresh]', 'Was expecting a refreshtoken.')
    console.log('[/auth/refresh]', 'Cookies:', req.cookies)

    return res.sendStatus(401)
  }

  console.log('[/auth/refresh]', 'Got refreshtoken, trying to verify...')

  try {
    const { id } = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
    console.log('[/auth/refresh]', 'Verified! Look for it in database...')
    const tokenInDatabase = await RefreshTokenModel.findOne({ token: refreshToken })

    if (tokenInDatabase) {
      if (tokenInDatabase.isValid) {
        const accessToken = jwt.sign({ id }, process.env.ACCESS_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: '7d' })

        await new RefreshTokenModel({ token: refreshToken, isValid: true })
          .save()

        await RefreshTokenModel.deleteOne({ refreshToken: tokenInDatabase })

        res.cookie('jid', refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7 // 7d in ms
        })
        res.json({ accessToken })
        console.log(
          '[/auth/refresh]',
          'Found a valid matching token and sent new tokens!'
        )
      } else {
        console.log('[/auth/refresh]', 'Found matching token but it is not valid.')
        res.sendStatus(403)
      }
    } else {
      console.log('[/auth/refresh]', 'Did not find matching token in database.')
      res.sendStatus(403)
    }
  } catch (err) {
    console.log(err)
    res.sendStatus(401)
  }
})

router.get('/logout', authenticate, async (req, res) => {
  const refreshToken = req.cookies.jid

  if (!refreshToken) {
    console.log('[/auth/logout]', 'Was expecting a refreshtoken.')
    console.log('[/auth/logout]', 'Cookies:', req.cookies)

    return res.sendStatus(401)
  }

  console.log('[/auth/logout]', 'Got refreshtoken, trying to verify...')

  try {
    jwt.verify(refreshToken, process.env.REFRESH_SECRET)
    console.log('[/auth/logout]', 'Verified! Look for it in database...')
    const tokenInDatabase = await RefreshTokenModel.findOne({ token: refreshToken })

    if (tokenInDatabase.isValid) {
      console.log('[/auth/logout]', 'Found a valid matching token. Delete it...')
      await RefreshTokenModel.deleteOne({ token: req.cookies.jid })
      res.clearCookie('jid')
      res.sendStatus(204)
      console.log('[/auth/logout]', 'Refreshtoken deleted from db and cookies!')
    } else {
      console.log('[/auth/logout]', 'Found matching token but it is not valid.')
      res.sendStatus(403)
    }
  } catch (err) {
    console.log(err)
    res.sendStatus(401)
  }
})

module.exports = router
