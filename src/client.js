const path = require('path')
const express = require('express')
const router = express.Router()

const CLIENT_BUILD = path.join(__dirname, '../client/build')
const CLIENT_HTML = path.join(CLIENT_BUILD, 'index.html')

router.use(express.static(CLIENT_BUILD))

router.get('*', (req, res) => res.sendFile(CLIENT_HTML))

module.exports = router
