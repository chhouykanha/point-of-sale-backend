
const express = require('express')
const { upload, remove } = require('../controllers/upload.controller')

const uploadRouter = express.Router()

uploadRouter.route('/')
    .post(upload)
    .delete(remove)
    
module.exports = uploadRouter