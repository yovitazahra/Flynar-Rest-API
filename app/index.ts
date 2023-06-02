import type { Request, Response } from 'express'
import express = require('express')

const app = express()
const port = 3000

app.use(express.json())

app.listen(port, () => {
  console.log(`\nApp Running on http://localhost:${port}`)
  console.log('Press Ctrl-C to terminate\n')
})

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome' })
})
