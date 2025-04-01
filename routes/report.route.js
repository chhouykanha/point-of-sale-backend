const express = require("express");
const {
  generalReport,
  saleReport,
  saleReportIn30Days,
  stockReport
} = require("../controllers/report.controller")

const authGuard = require("../guards/auth.guard");
const check = require("../guards/check.guard");

const router = express.Router();

router
    .get('/sale', saleReport)
    .get('/sale_in_30_days', saleReportIn30Days)
    .get('/stock', stockReport)
    .get('/general', generalReport)

module.exports = router;
