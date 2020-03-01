const router = require('express').Router()
const user = require('../controllers/UserControl')

router.post('/login', user.login)
router.post('/register', user.register)

module.exports = router
