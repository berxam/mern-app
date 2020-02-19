// Core modules
const http = require('http')

// Dependencies
const express = require('express')
// const socket = require('socket.io')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

// Connect to database
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error(err))

// Create Express application and pass it as a handler to
// the core HTTP server, so we can use it with Socket.io
const app = express()
const httpServer = http.createServer(app)
// const io = socket(httpServer) <- not in use yet so commented

// Middleware
app.use(cors())
app.use(express.json())

// Bind routes
app.use('/listings', require('./routes/listings'))

// Get address configured in .env or set defaults
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

// Start listening
httpServer.listen(PORT, HOST, () => {
  const { address, port } = httpServer.address()
  console.log(`Server running at \x1b[35m'http://${address}:${port}'\x1b[0m`)
})

// Handle server error
httpServer.on('error', err => {
  console.error(err.name + ': ' + err.message)
  httpServer.close()
  process.exit()
})
