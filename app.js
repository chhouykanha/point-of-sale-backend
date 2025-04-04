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


const allowedOrigins = [
  process.env.LOCAL_DOMAIN,
  `https://www.${process.env.CLIENT_DOMAIN}`,
  `https://www.${process.env.ADMIN_DOMAIN}`
];
console.log(allowedOrigins)
app.use(cors({
  origin: function (origin, callback) {
    console.log(origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie', 'Authorization']
}));

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

app.use('/', express.static('public', {
  setHeaders: (res, path, req) => {
    const origin = req.headers.origin;
    console.log(origin)
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  }
}));

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
