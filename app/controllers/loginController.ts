const { Users } = require('../models/index')
const { Request, Response, NextFunction } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
    },
    Login: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
        try {
            const user = await Users.findOne({
                where: {
                    username: req.body.username,
                    email: req.body.email,
                }
            })

            console.log(user)

            const match = await bcrypt.compare(req.body.password, user.password)
            if (!match) return res.status(400).json({
                message: 'password salah!'
            })

            const userId = user.id
            const username = user.username
            const email = user.email

            const accessToken = jwt.sign({
                userId,
                email,
                username
            }, 'a3xyP2tSDk0zUxHviDxZ1NdCNPA0DOK1Z6qd6aG9EWl8vVLEnVWdEfJWpqHV5', {
                expiresIn: '1d'
            })

            const refreshToken = jwt.sign({
                userId,
                email,
                username
            }, 'A6weD1Bef6pqF1yW4MZNplLpupLIWkc72Ij0VRXK5cxN1c25tilzGzap1OCT', {
                expiresIn: '1d'
            })

            await Users.update({
                refresh_token: refreshToken
            }, {
                where: {
                    id: userId
                }
            })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })

            res.json({
                accessToken
            })

        } catch (error) {
            console.log(error)
            res.status(404).json({
                message: 'email tidak ditemukan!'
            })
        }
    },
    Logout: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
       

        const user = await Users.findAll()
        if (!user[0]) return res.sendStatus(204)

        // update refresh token menjadi null
        await Users.update({
            refresh_token: null
        }, {
            where: {
                id: user[0].id
            }
        })

        // hapus cookie
        res.clearCookie('refreshToken')
        return res.status(200).json({
            message: 'Anda sudah logout!'
        })
    }
}