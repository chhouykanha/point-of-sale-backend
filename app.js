const dotenv = require("dotenv")
dotenv.config()
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const authGuard = require("./guards/auth.guard");

const authRouter = require("./routes/auth.route");
const categoryRouter = require("./routes/category.route");
const uploadRouter = require("./routes/upload.route");
const productRouter = require("./routes/product.route");
const supplyRouter = require("./routes/supply.route");
const customerRouter = require("./routes/customer.route");
const saleRouter = require("./routes/sale.route");
const purchaseRouter = require("./routes/purchase.route");
const userRouter = require('./routes/user.route')
const reportRouter = require('./routes/report.route')
const labelRouter = require('./routes/label.route')

const app = express();


app.use(cors({
  origin: [
    process.env.LOCAL_DOMAIN,
    `https://${process.env.CLIENT_DOMAIN}`,
    `https://${process.env.ADMIN_DOMAIN}`,
  ],
  credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/category", authGuard, categoryRouter);
app.use("/api/upload", authGuard, uploadRouter);
app.use("/api/product", productRouter);
app.use("/api/supply", authGuard, supplyRouter);
app.use("/api/customer", authGuard, customerRouter);
app.use("/api/sale",authGuard, saleRouter);
app.use('/api/purchase', authGuard, purchaseRouter)
app.use('/api/user', authGuard, userRouter)
app.use('/api/report',authGuard, reportRouter )
app.use('/api/label', authGuard, labelRouter)

app.use('/', express.static('public'))

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errMessage = err.message || "Server Error";


  res.status(statusCode).json({
    success: false,
    name: err.name,
    error: errMessage,
  });
});

module.exports = app;
