const { Request, Response, NextFunction } = require("express");
const { Tickets, Checkouts } = require("../models/index");

async function createCheckout(
    req: typeof Request,
    res: typeof Response,
    next: typeof NextFunction
): Promise<any> {
    const {
        fullName,
        familyName,
        phoneNumber,
        email,
        price,
        total,
        status,
        ticketId,
    } = req.body;

    try {
        const selectedTicket = await Tickets.findOne({
            where: { id: ticketId },
        });

        if (selectedTicket.total - total < 0) {
            return res.status(400).json({
                status: "FAILED",
                message: "Jumlah Tiket Tidak Cukup",
            });
        }

        await Checkouts.create({
            fullName,
            familyName,
            phoneNumber,
            email,
            price,
            total,
            status,
            ticketId,
            userId: req.id,
        });

        selectedTicket.total = selectedTicket.total - total;
        await selectedTicket.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Transaksi Dibuat",
        });
    } catch (error: any) {
        res.status(400).json({
            status: "FAILED",
            message: error.message,
        });
    }
}

async function getCheckouts(
    req: typeof Request,
    res: typeof Response
): Promise<any> {
    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    // example query => ?month=6&year=2023&day=23
    const year = req.query.year;
    const month = req.query.month;
    const day = req.query.day;

    try {
        const data = await Checkouts.findAll({
            include: {
                model: Users,
                attributes: ["id", "name"],
            },
        });

        //grouping by year & month
        if (!year || !month || !day) {
            let availableYear = [] as any;
            let availableData = [] as any;

            data.forEach((checkout: any) => {
                const value = checkout.dataValues;
                const year = new Date(value.createdAt).getUTCFullYear();
                availableYear.push(year);
            });

            availableYear = [...new Set(availableYear)];

            let filteredData = availableYear.map((year: number) => {
                return {
                    year,
                    data: months.map((month: string) => ({
                        month,
                        checkouts: [] as Checkout[],
                    })),
                };
            });

            data.forEach((checkout: any) => {
                const value = checkout.dataValues;
                const yearIndex = filteredData.findIndex(
                    (data: any) =>
                        data.year == new Date(value.createdAt).getUTCFullYear()
                );
                const monthIndex = new Date(value.createdAt).getUTCMonth() + 1;
                filteredData[yearIndex].data[monthIndex].checkouts.push(value);
            });

            for (let i = 0; i < availableYear.length; i++) {
                for (let j = 0; j < months.length; j++) {
                    if (filteredData[i].data[j].checkouts.length > 0) {
                        availableData.push({
                            year: filteredData[i].year.toString(),
                            data: {
                                month: filteredData[i].data[j].month,
                                checkouts: filteredData[i].data[j].checkouts,
                            },
                        });
                    }
                }
            }

            res.status(200).json({
                status: "success",
                data: availableData,
                // data: filteredData <= to display all data
            });
        }
        //selected specific date depend on url query
        else {
            let filteredData = [] as Checkout[];
            data.forEach((checkout: any) => {
                const value = checkout.dataValues;
                if (
                    new Date(value.createdAt).toLocaleDateString() ==
                    new Date(`${year}-${month}-${day}`).toLocaleDateString()
                ) {
                    filteredData.push(value);
                }
            });

            res.status(200).json({
                status: "success",
                data: filteredData,
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "failed",
            msg: error.message,
        });
    }
}

export {};
module.exports = { createCheckout, getCheckouts };
