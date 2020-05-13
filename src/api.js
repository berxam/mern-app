const router = require('express').Router()

router.use('/listings', require('./routes/listings'))
router.use('/users', require('./routes/users'))
router.use('/auth', require('./routes/auth'))

router.all('*', (req, res) => res.sendStatus(404))

module.exports = router
