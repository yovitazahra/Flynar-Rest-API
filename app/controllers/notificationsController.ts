const { Request, Response, NextFunction } = require("express");
const { Notifications, Tickets } = require("../models/index");

async function getNotifications(
    req: typeof Request,
    res: typeof Response
): Promise<any> {
    try {
        const data = await Notifications.findAll({ where: { userId: req.id } });

        res.status(200).json({
            status: "SUCCESS",
            data,
        });
    } catch (error: any) {
        res.status(404).json({
            status: "FAILED",
            message: error.message,
        });
    }
}

async function createNotification(
    req: typeof Request,
    res: typeof Response
): Promise<any> {
    const { text } = req.body;
    try {
        await Notifications.create({
            text,
            userId: req.id,
        });

        res.status(201).json({
            status: "SUCCESS",
            message: "Notification Dibuat",
        });
    } catch (error: any) {
        res.status(404).json({
            status: "FAILED",
            message: error.message,
        });
    }
}
module.exports = { getNotifications, createNotification };
