const expressRouter = require('express')
const { Users } = require('../../app/models/index')

const router = expressRouter.Router()

router.get('/', (req: any, res: any, next: any) => {
  res.status(200).json({
    status: 'SUCCESS',
    message: 'Welcome to Flynar Rest API'
  })
})

router.get('/users', async (req: any, res: any): Promise<any> => {
  try {
    const result = await Users.findAll()
    return res.status(200).json({
      status: 'SUCCESS',
      users: result
    })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
