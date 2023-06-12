const express = require('express')
const indexRouter = require('../config/routes/index')

const app = express()
const port = 3000

app.use(express.json())

app.listen(port, () => {
  console.log(`\nApp Running on http://localhost:${port}/api/v1`)
  console.log('Press Ctrl-C to terminate\n')
})

app.use('/', indexRouter)
