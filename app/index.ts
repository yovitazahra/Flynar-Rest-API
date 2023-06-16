const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const indexRouter = require('../config/routes/index')

dotenv.config()
const app = express()
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const port = process.env.PORT ?? 8001

app.use(express.json())
app.use(cors({
  origin: '*'
}))
app.use(cookieParser())
app.set('trust proxy', true)

app.listen(port, () => {
  console.log(`\nApp Running on http://localhost:${port}/api/v1`)
  console.log('Press Ctrl-C to terminate\n')
})

app.use('/', indexRouter)
