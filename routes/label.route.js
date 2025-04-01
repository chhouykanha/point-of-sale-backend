const {Router} = require('express')
const {create, findOne} = require('../controllers/label.controller')
const router = Router()

router
    .route('/')
    .get(create)
    .post(findOne)

module.exports = router
