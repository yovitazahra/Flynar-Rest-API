const express = require("express");
const { Users } = require("../../app/models/index");
const { Request, Response, NextFunction } = require("express");

const {
  getUserById,
  resetUserPasswordById,
} = require("../../app/controllers/userController");

const router = express.Router();

router.get(
  "/",
  (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    res.status(200).json({
      status: "SUCCESS",
      message: "Welcome to Flynar Rest API",
    });
  }
);

router.get(
  "/users",
  async (
    req: typeof Request,
    res: typeof Response,
    next: typeof NextFunction
  ): Promise<any> => {
    try {
      const result = await Users.findAll();
      return res.status(200).json({
        status: "SUCCESS",
        users: result,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

// router.get("/users/:id", authMiddleware, getUserById);
router.get("/users/:id", getUserById);

// router.get("/users/resetpassword/:id", authMiddleware, resetUserPasswordById);
router.patch("/users/resetpassword/:id", resetUserPasswordById);

export {};

module.exports = router;
