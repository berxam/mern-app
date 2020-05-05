const router = require('express').Router()

const UserModel = require('../models/UserModel')
const { notifEmitter } = require('../models/Notifications')
const { authenticate, cookieAuth } = require('../middleware/auth')

router.get('/:id', (req, res) => {
  // { username, rating }
})

router.put('/:id', authenticate, (req, res) => {
  console.log('in here')

  if (req.user.id !== req.params.id) {
    return res.sendStatus(403)
  }

  console.log('hello')
})

router.delete('/:id', authenticate, (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.sendStatus(403)
  }

  console.log('hello')
})

router.get('/:id/notifs', authenticate, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.sendStatus(403)
  }

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

module.exports = router
