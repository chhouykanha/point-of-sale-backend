const express = require("express");
const {
 create, 
 findAll,
 findOne,
 remove,
 update
} = require("../controllers/supply.controller")

const supplyRouter = express.Router()

supplyRouter
    .route('/')
    .get(findAll)
    .post(create)

supplyRouter
    .route('/:id')
    .get(findOne)
    .patch(update)
    .delete(remove)

module.exports = supplyRouter
