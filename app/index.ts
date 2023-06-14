const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const indexRouter = require('../config/routes/index')

dotenv.config()

dotenv.config()
const app = express()
const port = 3000

app.use(express.json())
app.use(cors({ origin: process.env.REMOTE_CLIENT_APP, credentials: true }))
app.use(cookieParser())

app.listen(port, () => {
  console.log(`\nApp Running on http://localhost:${port}/api/v1`)
  console.log('Press Ctrl-C to terminate\n')
})

app.use('/', indexRouter)
