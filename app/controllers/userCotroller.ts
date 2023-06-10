const { Request, Response } = require("express");
const bcrypt = require("bcrypt");
const { Users } = require("../models/index");
const { sendEmail } = require("../service/sendEmail");
const { generateOTP } = require("../service/otpGenerator");

async function registerUsers(req: typeof Request, res: typeof Response) {
  const { username, email, password, firstName, lastName, phoneNumber } =
    req.body;

  if (
    username === "" ||
    email === "" ||
    password === "" ||
    firstName === "" ||
    lastName === "" ||
    phoneNumber === ""
  ) {
    return res.status(400).json({
      status: "failed",
      msg: "Mohon Lengkapi Data",
    });
  }

  const isExisting = await findUserByEmail(email);
  if (isExisting) {
    return res.status(400).json({
      status: "failed",
      msg: "Email sudah terdaftar",
    });
  }
  const newUser = await createUser(
    username,
    email,
    password,
    firstName,
    lastName,
    phoneNumber
  );

  res.status(201).json({
    status: "success",
    data: newUser,
  });
}
async function findUserByEmail(email: string) {
  const user = await Users.findOne({
    email,
  });
  if (!user) {
    return false;
  }
  return user;
}

async function createUser(
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string
) {
  const hashPassword = bcrypt.hashSync(password, 10);
  const otpGenerated = generateOTP();
  const newUser = await Users.create({
    username,
    email,
    password: hashPassword,
    firstName,
    lastName,
    phoneNumber,
    otp: otpGenerated,
  });
  try {
    await sendEmail({
      to: email,
      OTP: otpGenerated,
    });
    return newUser;
  } catch (error: any) {
    return error;
  }
}

async function verifyEmail(req: typeof Request, res: typeof Response) {
  const { email, otp } = req.body;
  const user = await validateRegisterUser(email, otp);
  res.send(user);
}

async function validateRegisterUser(email: string, otp: number) {
  const user = await Users.findOne({
    email,
  });
  console.log(user.dataValues.email);
  if (!user) {
    return [false, "User not found"];
  }
  if (user && user.otp !== otp) {
    return [false, "Invalid OTP"];
  }

  return ["Verifikasi berhasil"];
}

export {};
module.exports = {
  registerUsers,
  verifyEmail,
};
