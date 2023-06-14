const express = require('express')
const cookieParser = require('cookie-parser')
const indexRouter = require('../config/routes/index')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = 3000

app.use(express.json())
app.use(cookieParser())

app.listen(port, () => {
  console.log(`\nApp Running on http://localhost:${port}`)
  console.log('Press Ctrl-C to terminate\n')
})

app.use('/', indexRouter)
