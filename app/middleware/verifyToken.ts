const jwt = require('jsonwebtoken')
export const verifyToken = (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401)

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err:Error, decoded:any) => {
        if(err) return res.status(403).json({message:'Akses ditolak! silahkan login terlebih dahulu~'})
        req.email = decoded.email
        next()
    })
}
