const { Users } = require("../models/index");
const { Request, Response } = require("express");
const { userTransformer } = require("../utils/userTransformer");
const bcrypt = require("bcryptjs");

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
    /* if the user exist. CAN BE DELETE because userId/data passed by authMiddleware (already checking there) */
    const userRecord = await Users.findByPk(userId);
    if (!userRecord) {
      return res.status(404).json({
        status: "FAILED",
        message: `No User Found with id: ${userId}`,
      });
    }
    /* if the user exist. CAN BE DELETE because userId/data passed by authMiddleware (already checking there)*/

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

export const resetUserPasswordById = async (
  req: typeof Request,
  res: typeof Response
): Promise<any> => {
  const userId = Number(req.params.id);
  const { newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({
      status: "FAILED",
      message: "Invalid Params",
    });
  }

  /* Password validation */
  // password length must be greater than 5
  if (newPassword.length <= 5) {
    return res.status(400).json({
      status: "FAILED",
      message: "Password length must be greater than 5",
    });
  }

  // password should contain at least 1 number
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  let isIncludeNumber = false;

  numbers.forEach((num: number) => {
    if (newPassword.split("").includes(num.toString())) {
      isIncludeNumber = true;
    }
  });

  if (!isIncludeNumber) {
    return res.status(400).json({
      status: "FAILED",
      message: "Password should contain at least 1 number",
    });
  }
  /* Password validation */

  try {
    /* if the user exist. CAN BE DELETE because userId/data passed by authMiddleware (already checking there) */
    const userRecord = await Users.findByPk(userId);

    if (!userRecord) {
      return res.status(404).json({
        status: "FAILED",
        message: `No User Found with id: ${userId}`,
      });
    }
    /* if the user exist. CAN BE DELETE because userId/data passed by authMiddleware (already checking there) */

    const hashedPassword = bcrypt.hashSync(newPassword);
    Users.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    return res.status(200).json({
      status: "SUCCESS",
      message: `Password reset success`,
    });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({
        status: "FAILED",
        message: err.message,
      });
    }
  }

  return res.json({
    userId,
    newPassword,
  });
};
