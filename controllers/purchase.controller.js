const ProductModel = require("../models/product.model");
const PurchaseModel = require("../models/purchase.model");
const calculatePaymentStatus = require("../utils/calculatePaymentStatus");

exports.create = async (req, res, next) => {
  try {
    const { items, totalCost, purchaseStatus } = req.body;
    const paymentStatus = calculatePaymentStatus(totalCost, 0);
    //1). update stock product
    if (purchaseStatus === "received") {
      for (const item of items) {
        const product = await ProductModel.findById(item.product);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product with ID ${product.name} not found.`,
          });
        }

        // Update stock
        product.currentStock = (product.currentStock || 0) + item.quantity;
        await product.save();
      }
    }

    // 3. Insert purchase record into the database
    const purchase = await PurchaseModel.create({
        ...req.body,
        paymentStatus,
        dueAmount: totalCost,
        user: req.user?._id,
    });

    res.status(200).json({
      success: true,
      result: purchase,
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

    const docs = await PurchaseModel.find(querySearch)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .populate("supply")
      .populate("user")
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "_id name imageUrl salePrice costPrice", // Specify the fields you want here
        },
      });

    const totalItem = await PurchaseModel.find(querySearch).countDocuments();
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

exports.updatePurchaseStatus = async (req, res, next) => {
    try {
        const {id} = req.params
        const { purchaseStatus } = req.body;

        const doc = await PurchaseModel.findById(id)
        if(!doc){
            return res.status(404).json({error: "No document found with that ID"})
        }

        //1). update stock product
        if (purchaseStatus === "received") {
          for (const item of doc.items) {
            const product = await ProductModel.findById(item.product);
            if (!product) {
              return res.status(404).json({
                success: false,
                message: `Product with ID ${product.name} not found.`,
              });
            }

            // Update stock
            product.currentStock = (product.currentStock || 0) + item.quantity;
            await product.save();
          }
        }
   
        // 3. Insert purchase record into the database
        const purchase = await PurchaseModel.findByIdAndUpdate(id,{
            purchaseStatus,
        });
    
        res.status(200).json({
          success: true,
          result: purchase,
        });
      } catch (error) {
        next(error);
      }
}

exports.addPayment = async (req, res, next) => {
    try {
      
      const {id} = req.params
      const { paidAmount } = req.body;
  
      // Step 1: Retrieve the sale using the invoice number
      const purchase = await PurchaseModel.findOne({_id: id});
  
      if (!purchase) {
        return res
          .status(404)
          .json({ error: "Purchase not found with that ID!" });
      }
  
      // Step 2: Calculate the new payment status and due amount
      const totalCost = purchase.totalCost; // Total cost from the purchase
      const newPaidAmount = purchase.paidAmount + paidAmount; // Update the paid amount
  
      // Calculate new due amount
      const newDueAmount = Math.max(0, totalCost - newPaidAmount);
  
      // Determine new payment status
      const paymentStatus = calculatePaymentStatus(totalCost, newPaidAmount);
  
      // Step 3: Update the sale with the new payment details
      const updatedPurchase = await PurchaseModel.findOneAndUpdate(
        {_id: id},
        {
          paidAmount: newPaidAmount,
          paymentStatus,
          dueAmount: newDueAmount,
        }
      );
  
      res.status(201).json({
        success: true,
        result: updatedPurchase,
      });
    } catch (error) {
      next(error);
    }
};

exports.findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await PurchaseModel.findOne({ _id: id })
    .populate("supply")
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
        .json({ message: "No document found with that id!" });
    }

    res.status(200).json({
      success: true,
      result: doc,
    });
  } catch (error) {
    next(error);
  }
};