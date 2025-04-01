const express = require("express");

const {
  checkStock,
  create,
  addPayment,
  findAll,
  findOne,
} = require("../controllers/sale.controller");
const saleRouter = express.Router();

saleRouter
    .route("/")
    .post(create)
    .get(findAll)

saleRouter
    .route("/addPayment/:id")
    .patch(addPayment)

saleRouter
    .route("/checkStock")
    .get(checkStock)

saleRouter.route("/:id").get(findOne);

module.exports = saleRouter;
