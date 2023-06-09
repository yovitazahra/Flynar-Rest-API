const { Flights } = require('../models/index')
const { Request, Response, NextFunction } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


module.exports = {
    flightList: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
        try {
            const result = await Flights.findAll()
            return res.status(200).json({
                status: 'SUCCESS',
                users: result
            })
        } catch (err) {
            console.log(err)
        }
    },
    flightDetail: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {

        const result = await Flights.findOne({ where: { id: req.params.id } })
        if (result === null) {
            res.json({ status: 'ERROR', message: 'Data tidak ditemukan!' })
        }
        return res.status(200).json({
            status: 'SUCCESS',
            users: result
        })
    }
}