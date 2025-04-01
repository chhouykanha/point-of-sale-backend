const ProductModel = require("../models/product.model");
const SaleModel = require("../models/sale.model");
const calculatePaymentStatus = require("../utils/calculatePaymentStatus");
const { generateInvoiceNumber } = require("./counter.controller");


exports.create = async (req, res, next) => {
  try {
    const { items, totalCost, paidAmount } = req.body;

    // Step 1: Fetch all products at once to validate stock
    const productIds = items.map((item) => item.product);
    const products = await ProductModel.find({ _id: { $in: productIds } });

    // Step 2: Validate stock for each product
    const productUpdates = [];
    for (const item of items) {
      const product = products.find(
        (p) => p._id.toString() === item.product.toString()
      );

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product not found with ID: ${item.product}` });
      }

      if (product.currentStock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for product: ${product.name}`,
        });
      }

      // Prepare stock update for the product
      productUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { currentStock: -item.quantity } }, // Decrease stock by item quantity
        },
      });
    }

    // Step 3: Execute the stock updates in bulk
    await ProductModel.bulkWrite(productUpdates);

    // Step 4: Calculate payment status
    const paymentStatus = calculatePaymentStatus(totalCost, paidAmount);

    // Step 5: Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Step 6: Calculate due amount
    const dueAmount = Math.max(0, totalCost - paidAmount);

    // Step 6: Calculate change amount
    const changeAmount = Math.max(0, paidAmount - totalCost);

    // Step 7: Create new sale document
    const newSale = await SaleModel.create({
      ...req.body,
      invoiceNumber,
      paymentStatus,
      dueAmount,
      changeAmount,
      user: req.user?._id,
    });

    // Step 8: Return response with the created sale
    res.status(201).json({
      success: true,
      result: newSale,
    });
  } catch (error) {
    next(error);
  }
};

exports.checkStock = async (req, res, next) => {
  try {
    const stock = req.query.stock * 1;
    const product = req.query.product;

    if (!stock || !product) {
      return res
        .status(400)
        .json({ error: "Please provide stock and product" });
    }

    const doc = await ProductModel.findById(product);
    if (!doc) {
      return res.status(404).json({ error: "Product not found!" });
    }

    if (doc.currentStock < stock) {
      return res
        .status(400)
        .json({ error: `Insufficient stock for product: ${doc.name}` });
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

exports.addPayment = async (req, res, next) => {
  try {
    const { paidAmount } = req.body;
    const {id} = req.params;

    // Step 1: Retrieve the sale using the invoice number
    const sale = await SaleModel.findOne({ _id: id });

    if (!sale) {
      return res
        .status(404)
        .json({ error: "Sale not found with that id!" });
    }

    // Step 2: Calculate the new payment status and due amount
    const totalCost = sale.totalCost; // Total cost from the sale
    const newPaidAmount = sale.paidAmount + paidAmount * 1; // Update the paid amount

    // Calculate new due amount
    const newDueAmount = Math.max(0, totalCost - newPaidAmount);

    const changeAmount = Math.max(0, newPaidAmount - totalCost);

    // Determine new payment status
    const paymentStatus = calculatePaymentStatus(totalCost, newPaidAmount);

    // Step 3: Update the sale with the new payment details
    const updatedSale = await SaleModel.findOneAndUpdate(
      { _id:  id },
      {
        paidAmount: newPaidAmount,
        paymentStatus,
        dueAmount: newDueAmount,
        changeAmount
      }
    );

    res.status(201).json({
      success: true,
      result: updatedSale,
    });
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 25;
    const skip = (page - 1) * limit;

    const querySearch = {};

    if (req.query.search) {
      querySearch["$or"] = [
        { invoiceNumber: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const docs = await SaleModel.find(querySearch)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .populate("customer")
      .populate("user")
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "_id name imageUrl salePrice costPrice", // Specify the fields you want here
        },
      });

    const totalItem = await SaleModel.find(querySearch).countDocuments();
    const totalPage = Math.ceil(totalItem / limit);

    res.status(200).json({
      success: true,
      totalPage,
      result: docs,
    });
  } catch (error) {
    next(error);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await SaleModel.findOne({ _id: id })
      .populate("customer")
      .populate("user")
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "_id name imageUrl salePrice costPrice", // Specify the fields you want here
        },
        
      });
    if (!doc) {
      return res
        .status(404)
        .json({ message: "No document found with that invoice number!" });
    }

    res.status(200).json({
      success: true,
      result: doc,
    });
  } catch (error) {
    next(error);
  }
};
