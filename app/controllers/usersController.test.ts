import { describe, it } from "node:test";

const { Users } = require("../models/index");
const usersController = require("./usersController");

describe("usersController", () => {
  describe("#registerUsers"),
    () => {
      it("should call res.status(201) and res.json with status and user instance", async () => {
        const name = "Hello";
        const email = "string";
        const password = "string";
        const phoneNumber = "string";
      });
    };
});
