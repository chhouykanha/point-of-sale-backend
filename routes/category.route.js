const express = require("express");
const {
 create, 
 findAll,
 findOne,
 remove,
 update
} = require("../controllers/category.controller")

const categoryRouter = express.Router()

categoryRouter
    .route('/')
    .post(create)
    .get(findAll)

categoryRouter
    .route('/:id')
    .get(findOne)
    .patch(update)
    .delete(remove)

module.exports = categoryRouter
