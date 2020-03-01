// Core modules
const http = require('http')

// Dependencies
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

// Connect to database
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

// Create Express application and pass it as a handler to
// the core HTTP server, so we can use it with Socket.io (later on)
const app = express()
const httpServer = http.createServer(app)

// Middleware
app.use(cors())
app.use(express.json())

// Bind routes
app.use('/listings', require('./routes/listings'))
app.use('/users', require('./routes/users'))

// Start listening on address in .env or localhost:5000
httpServer.listen(
  process.env.PORT || 5000,
  process.env.HOST || 'localhost',
  () => {
    const { address, port } = httpServer.address()
    console.log(`Server running at \x1b[35m'http://${address}:${port}'\x1b[0m`)
  }
)
