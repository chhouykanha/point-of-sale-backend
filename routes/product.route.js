const express = require("express");
const {
 create, 
 findAll,
 findOne,
 remove,
 update,
 findOneByCode
} = require("../controllers/product.controller")

const productRouter = express.Router()

productRouter
    .route('/')
    .get(findAll)
    .post(create)

productRouter
    .route('/:id')
    .get(findOne)
    .patch(update)
    .delete(remove)

productRouter
    .route('/code/:code')
    .get(findOneByCode)

module.exports = productRouter
