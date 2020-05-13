const { randomBytes } = require('crypto')
const router = require('express').Router()
const ROLES = require('../helpers/roles')
const UserModel = require('../models/UserModel')
const { notifEmitter } = require('../models/Notifications')
const { authenticate, cookieAuth, ensureUserId } = require('../middleware/auth')
const { getObjectFields } = require('../helpers/objects')
const sendMail = require('../helpers/sendMail')

router.get('/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id, 'username rating location description')
    console.log(user)
    res.json(user)
  } catch (err) {
    switch (err.name) {
      case 'CastError':
        res.sendStatus(404)
        break
      default:
        res.status(500).json(err)
    }
  }
})

router.post('/', async (req, res) => {
  const newUser = new UserModel(req.body)

  try {
    await newUser.save()
    res.sendStatus(201)
  } catch (error) {
    console.log(error)
    res.status(400).json({ errors: [error.message] })
  }
})

router.put('/verify', async (req, res) => {
  const verificationKey = req.body.key

  try {
    const user = await UserModel.findOne({ verificationKey })
    user.verified = true
    await user.save()
    res.sendStatus(204)
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

router.put('/reset-password', async (req, res) => {
  const email = req.body.email

  try {
    const user = await UserModel.findOne({ email })
    const randomPassword = randomBytes(32).toString('hex')
    user.password = randomPassword
    await user.save()
    await sendMail({
      to: email,
      subject: 'Password resetted',
      html: `Your new password is ${randomPassword}`
    })
    res.sendStatus(204)
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

router.put('/:id', [authenticate(ROLES.BASIC), ensureUserId()], async (req, res) => {
  const _id = req.params.id
  const updateBody = getObjectFields(req.body,
    'username email password location description'
  )

  try {
    const user = await UserModel.findOneAndUpdate({ _id }, updateBody, { new: true })
    res.json(user)
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

router.post('/:id/rating', authenticate(ROLES.BASIC), async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)

    user.ratings.push({
      creatorId: req.user.id,
      isPositive: req.body.isPositive,
      comment: req.body.comment
    })

    await user.save()
    res.sendStatus(201)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

router.delete('/:id', [authenticate(ROLES.BASIC), ensureUserId()], async (req, res) => {
  try {
    const result = await UserModel.remove({ _id: req.params.id })
    if (!result) res.sendStatus(404)
    res.json(result)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get('/:id/notifs', [authenticate(ROLES.BASIC), ensureUserId()], async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
    const sortedNotifs = [...user.notifications].sort((a, b) => (
      b.createdAt - a.createdAt
    ))
    res.json(sortedNotifs)
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/:id/notifs/stream', [cookieAuth, ensureUserId()], (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  })
  res.flushHeaders()
  res.write('retry: 10000\n\n')

  const writeToStream = (notif, id) => {
    if (req.user.id === id.toString()) {
      res.write(`data: ${JSON.stringify(notif)}\n\n`)
    }
  }

  notifEmitter.addListener('newNotif', writeToStream)

  res.on('close', () => {
    notifEmitter.removeListener('newNotif', writeToStream)
    res.end()
  })
})

router.put('/:id/notifs/mark-read', [authenticate(ROLES.BASIC), ensureUserId()], async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
    const allRead = user.notifications.map(notif => {
      if (notif.isUnseen) {
        notif.isUnseen = false
      }

      return notif
    })
    user.notifications = allRead
    await user.save()
    res.sendStatus(204)
  } catch (err) {
    res.status(500).json(err)
  }
})

router.delete('/:userId/notifs/:notifId', [authenticate(ROLES.BASIC), ensureUserId('userId')], async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id)
    user.notifications.remove({ _id: req.params.notifId })
    await user.save()
    res.sendStatus(204)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
