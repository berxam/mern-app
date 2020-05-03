const router = require('express').Router()

const UserModel = require('../models/UserModel')
const { notifEmitter } = require('../models/Notifications')
const { authenticate, cookieAuth } = require('../middleware/auth')

router.get('/test', authenticate, async (req, res) => {
  console.log('GET /test')
  try {
    const user = await UserModel.findById(req.user.id)
    console.log('User found')
    user.notifications.push({
      title: 'Well this happened'
    })
    notifEmitter.emit('new-notif', { title: 'ploahaha' }, req.user.id)
    console.log('Notif added')
    await user.save()
    console.log('User saved')
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

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
    res.json(user.notifications)
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
    if (req.params.id === id) {
      console.log('Sending event to client...')
      res.write(`data: ${JSON.stringify(notif)}\n\n`)
    }
  }

  console.log('Listening for notifications...')
  notifEmitter.addListener('new-notif', writeToStream)

  res.on('close', () => {
    notifEmitter.removeListener('new-notif', writeToStream)
    res.end()
  })
})

module.exports = router
