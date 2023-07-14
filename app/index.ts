const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const indexRouter = require('../config/routes/index')

dotenv.config()
const app = express()
const port = process.env.PORT ?? 8001

app.use(express.json())
const corsOptions = {
  origin: ['http://localhost:3000', 'https://flynar.vercel.app'],
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(cookieParser())
app.set('trust proxy', true)

app.listen(port, () => {
  console.log(`\nApp Running on http://localhost:${port}/api/v1`)
  console.log('Press Ctrl-C to terminate\n')
})

app.use('/', indexRouter)
