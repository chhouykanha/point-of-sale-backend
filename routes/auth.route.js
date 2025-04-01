const express = require("express");
const {
  signup,
  signin,
  signout,
  current,
} = require("../controllers/auth.controller");
const authGuard = require("../guards/auth.guard");
const check = require("../guards/check.guard");

const authRouter = express.Router();

authRouter
  .post("/signin", signin)
  .post("/signup",authGuard,check("admin", "super"), signup)
  .get("/signout", authGuard, signout)
  .get("/current", authGuard, current);

module.exports = authRouter;
