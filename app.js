const dotenv = require("dotenv")
dotenv.config()
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const authGuard = require("./guards/auth.guard");
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const morgan = require("morgan")
const mongoSanitize = require("express-mongo-sanitize")

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

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit:1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message:{
        success: false,
        error: 'Too many requests from this IP, Please try again!'
    }
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet())
app.use(limiter)
app.use(mongoSanitize())

app.use(morgan('combined', {
  stream: {
      write: (message) => console.log(message.trim())
  }
}))



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
  console.log(err.stack)

  res.status(statusCode).json({
    success: false,
    name: err.name,
    error: errMessage,
  });
});

module.exports = app;
