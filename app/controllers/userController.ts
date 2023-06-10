const { Users } = require("../models/index");
const { Request, Response } = require("express");
const { userTransformer } = require("../utils/userTransformer");

export const getUserById = async (
    req: typeof Request,
    res: typeof Response
): Promise<any> => {
    const userId = Number(req.params.id);

    if (!userId) {
        return res.status(400).json({
            status: "FAILED",
            message: "Invalid Params",
        });
    }

    try {
        const userRecord = await Users.findByPk(userId);

        if (!userRecord) {
            return res.status(404).json({
                status: "FAILED",
                message: `No User Found with id: ${userId}`,
            });
        }

        return res.status(200).json({
            status: "SUCCESS",
            data: userTransformer(userRecord),
        });
    } catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                status: "FAILED",
                message: err.message,
            });
        }
    }
};
