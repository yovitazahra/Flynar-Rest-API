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
const allowList = ['http://localhost:3000', 'https://flynar.vercel.app']

const corsOptionsDelegate = function (req: any, callback: any): void {
  let corsOptions
  if (allowList.includes(req.header('Origin'))) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate))
app.use(cookieParser())
app.set('trust proxy', true)

app.listen(port, () => {
  console.log(`\nApp Running on http://localhost:${port}/api/v1`)
  console.log('Press Ctrl-C to terminate\n')
})

app.use('/', indexRouter)
