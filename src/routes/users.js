const router = require('express').Router()

const UserModel = require('../models/UserModel')
const { notifEmitter } = require('../models/Notifications')
const { authenticate, cookieAuth } = require('../middleware/auth')

router.get('/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id, 'username rating')
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

router.put('/:id', authenticate, (req, res) => {
  if (req.user.id !== req.params.id) return res.sendStatus(403)
  // TO DO: update user
})

router.delete('/:id', authenticate, (req, res) => {
  if (req.user.id !== req.params.id) return res.sendStatus(403)
  // TO DO: delete user & all listings with userId
})

router.get('/:id/notifs', authenticate, async (req, res) => {
  if (req.user.id !== req.params.id) return res.sendStatus(403)

  try {
    const user = await UserModel.findById(req.params.id)
    const sortedNotifs = [...user.notifications].sort((a, b) => (
      b.createdAt - a.createdAt
    ))
    res.json(sortedNotifs)
  } catch (err) {
    res.sendStatus(500)
  }
})

router.get('/:id/notifs/stream', cookieAuth, (req, res) => {
  if (req.user.id !== req.params.id) return res.sendStatus(403)

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

router.put('/:id/notifs/mark-read', authenticate, async (req, res) => {
  if (req.user.id !== req.params.id) return res.sendStatus(403)

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
    res.sendStatus(200)
  } catch (err) {
    res.sendStatus(500)
  }
})

module.exports = router
