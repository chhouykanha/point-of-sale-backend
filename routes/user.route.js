const express = require('express')
const { findAll,remove, findOne, update } = require('../controllers/user.controller')

const router = express.Router()

router
    .route('/')
    .get(findAll)

router
    .route('/:id')
    .get(findOne)
    .delete(remove)
    .patch(update)

module.exports = router