const { Users } = require('../../app/models/index');
const { Request, Response, NextFunction } = require('express');
const { kirimEmail } = require('../helpers');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

module.exports = {
    getAllUsers: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
        try {
            const result = await Users.findAll();
            return res.status(200).json({
                status: 'SUCCESS',
                users: result,
            });
        } catch (err) {
            console.log(err);
        }
    },
    forgotPassword: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
        const { email } = req.body;
        const user = await Users.findOne({ where: { email: email } });

        if (!user) {
            return res.status(200).json({ message: 'Email tidak ditemukan!', status: false });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        await user.update({ resetPasswordLink: token });

        const templateEmail = {
            from: 'flynar@gmail.com',
            to: email,
            subject: 'Reset Password Link',
            html: `<h2>Silahkan klik link dibawah ini untuk reset password anda!</h2>
                    <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`,
        };

        kirimEmail(templateEmail);

        return res.status(200).json({ message: 'Link reset password berhasil terkirim!', status: true });
    },
    resetPassword: async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<any> => {
        const { token, password, Newpassword } = req.body;
        const user = await Users.findOne({
            where: {
                resetPasswordLink: token,
            },
        });
        console.log('password sebelumnya :', user.password);

        const isMatch = bcryptjs.compareSync(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const hashPassword = await bcryptjs.hash(Newpassword, 10)
        user.password = hashPassword
        await user.save()
        return res.status(201).json({ status: true, message: 'Password berhasil diubah!' })
    },
};
