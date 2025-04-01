const express = require('express')
const {create, updatePurchaseStatus,findAll, addPayment, findOne} = require('../controllers/purchase.controller')
const purchaseRouter = express.Router()

purchaseRouter
    .route('/')
    .post(create)
    .get(findAll)

purchaseRouter
    .route('/:id')
    .patch(updatePurchaseStatus)
    .get(findOne)

purchaseRouter.patch('/addPayment/:id', addPayment)

module.exports = purchaseRouter