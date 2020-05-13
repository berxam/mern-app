const { resolve } = require('path')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const attachHostUrls = require('./middleware/attachHostUrls')
require('dotenv').config()

// Connect to database
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

const app = express()

// Middleware
app.use(cors(/* { credentials: true, origin: 'http://localhost:3000' } */))
app.use('/uploads', express.static(resolve(__dirname, '../uploads')))
app.use(express.json())
app.use(cookieParser())
app.use(attachHostUrls)

// Bind app routes
app.use('/api', require('./api'))
app.use('/', require('./client'))

// Start listening on address in .env or localhost:5000
// const server =
app.listen(
  process.env.PORT || 8080 // ,
//  process.env.HOST || 'localhost',
//  () => {
//    const { address, port } = server.address()
//    console.log(`Server running at \x1b[35m'http://${address}:${port}'\x1b[0m`)
//  }
)
