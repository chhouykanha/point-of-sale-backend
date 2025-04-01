const express = require("express");
const {
 create, 
 findAll,
 findOne,
 remove,
 update
} = require("../controllers/customer.controller")

const customerRouter = express.Router()

customerRouter
    .route('/')
    .get(findAll)
    .post(create)

customerRouter
    .route('/:id')
    .get(findOne)
    .patch(update)
    .delete(remove)

module.exports = customerRouter
