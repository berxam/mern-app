// Core modules
const http = require('http')

// Dependencies
// const socket = require('socket.io') <- not in use yet so commented
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

// Connect to database
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => shutDown(err))

// Create Express application and pass it as a handler to
// the core HTTP server, so we can use it with Socket.io
const app = express()
const httpServer = http.createServer(app)
// const io = socket(httpServer)

// Middleware
app.use(cors())
app.use(express.json())

// Bind routes
app.use('/listings', require('./routes/listings'))

// Start listening address in .env or localhost:5000
httpServer.listen(process.env.PORT || 5000, process.env.HOST || 'localhost', () => {
  const { address, port } = httpServer.address()
  console.log(`Server running at \x1b[35m'http://${address}:${port}'\x1b[0m`)
})

// Handle server error
httpServer.on('error', err => {
  httpServer.close()
  shutDown(err)
})

/**
 * Outputs error to console and exits process.
 *
 * @param {Error} err Error to output.
 */
function shutDown (err) {
  console.error(`${err.name}: ${err.message}`)
  process.exit(err.code)
}
