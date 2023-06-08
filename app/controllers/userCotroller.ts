const { Request, Response, NextFunction } = require("express");
const bcrypt = require("bcrypt");
const { Users } = require("../models/users");

async function registerUsers(req: typeof Request, res: typeof Response) {
  try {
    const { username, email, password, firstName, lastName, phoneNumber } =
      req.body;
    const hashPassword = bcrypt.hashSync(password, 10);
    const newUser = await Users.create({
      username: username,
      email: email,
      password: hashPassword,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
    });
    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      msg: error.message,
    });
  }
}

async function verifyEmail(req: typeof Request, res: typeof Response) {
  const { email, otp } = req.body;
}

async function validateRegisterUser(email: string, otp: number) {
  const user = await Users.findOne({
    email,
  });
  if (!user) {
    return [false, "User not found"];
  }
  if (user && user.otp !== otp) {
    return [false, "Invalid OTP"];
  }
  const updatedUser = await User.findByIdAndUpdate(user._id, {
    $set: { active: true },
  });
  return [true, updatedUser];
}

module.exports = {
  registerUsers,
};
