const { Users } = require('../models/index')

module.exports = {
  usersList: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
    try {
      const result = await Users.findAll()
      return res.status(200).json({
        status: 'SUCCESS',
        users: result
      })
    } catch (err) {
      console.log(err)
    }
  }
}
