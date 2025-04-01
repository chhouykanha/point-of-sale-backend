const ProductModel = require("../models/product.model");
const SaleModel = require("../models/sale.model");
const PurchaseModel = require("../models/purchase.model");
const CustomerModel = require("../models/customer.model")
const SupplyModel = require("../models/supplier.model")

exports.saleReport = async (req, res, next) => {
  try {
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;

    if (!start_date || !end_date) {
      return res
        .status(400)
        .json({ message: "Start date and End date are required." });
    }

    // Convert the start_date and end_date to Date objects
    const startDate = new Date(start_date).setHours(0, 0, 0, 0);
    const endDate = new Date(end_date).setHours(23, 59, 59, 999);

    const sales = await SaleModel.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .populate("customer")
      .populate("user")
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "_id name imageUrl salePrice costPrice", // Specify the fields you want here
        },
      });
    
      const totalAmount = sales.reduce(
        (sum, sale) => sum + sale.totalCost,
        0
      );

    res.status(200).json({
      success: true,
      totalAmount,
      result: sales,
    });
  } catch (error) {
    next(error);
  }
};

exports.stockReport = async (req, res, next) => {
  try {
    if (!req.query.stockQty) {
      return res.status(400).json({
        success: false,
        error: "Please provide stock qty",
      });
    }

    const docs = await ProductModel.find({
      currentStock: {
        $lte: req.query.stockQty * 1,
      },
    }).populate({
      path: 'category',
      select: 'name'
    });

    res.json({
      success: true,
      result: docs,
    });
  } catch (error) {
    next(error);
  }
};

exports.generalReport = async (req, res, next) => {
  try {
    const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfToday = new Date(new Date().setHours(23, 59, 59, 999));

    const monthStart = new Date(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1).setHours(
        0,
        0,
        0,
        0
      )
    );
    const monthEnd = new Date(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).setHours(
        23,
        59,
        59,
        999
      )
    );

    const todaySales = await SaleModel.find(
      {
        createdAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      },
      { totalCost: 1 }
    );

    // Calculate the total amount sum manually
    const totalSaleToday = todaySales.reduce(
      (sum, sale) => sum + sale.totalCost,
      0
    );

    const dueSales = await SaleModel.find(
      { paymentStatus: "due" },
      { totalCost: 1 }
    );
    const totalDueAmountSale = dueSales.reduce(
      (sum, sale) => sum + sale.totalCost,
      0
    );

    const duePurchase = await PurchaseModel.find(
      { paymentStatus: "due" },
      { totalCost: 1 }
    );
    const totalDueAmountPurchase = duePurchase.reduce(
      (sum, sale) => sum + sale.totalCost,
      0
    );

    const monthlySales = await SaleModel.find(
      {
        createdAt: {
          $gte: monthStart,
          $lte: monthEnd,
        },
      },
      { totalCost: 1, createdAt: 1 }
    );
    const totalAmountSale = monthlySales.reduce(
      (sum, sale) => sum + sale.totalCost,
      0
    );

 
    // count all customers
    const totalCustomers = await CustomerModel.countDocuments()
    const totalSuppliers = await SupplyModel.countDocuments()
    const totalPurchaseDue = await PurchaseModel.find({paymentStatus: 'due'}).countDocuments()
    const totalSaleDue = await SaleModel.find({paymentStatus: 'due'}).countDocuments()

    res.status(200).json({
      success: true,
      result: {
        totalSaleToday,
        totalDueAmountSale,
        totalDueAmountPurchase,
        totalAmountSale,
        totalCustomers,
        totalSaleDue,
        totalSuppliers,
        totalPurchaseDue,
        monthlySales
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.saleReportIn30Days = async (req, res, next) => {
    try{

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const sales = await SaleModel.find({ createdAt: { $gte: thirtyDaysAgo } }, {createdAt: 1, totalCost: 1});
      
      res.status(200).json({
        success: true,
        totalSales: sales
      })

    }catch(error){
      next(error)
    }
}
