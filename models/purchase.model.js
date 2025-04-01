const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user  is required"],
    },

    supply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supply",
      required: [true, "supply is required"],
    },

    invoiceNumber: {
      type: String,
      unique: true,
    },

    purchaseDate: {
      type: Date,
      required: [true, "Purchase date is required"],
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],

    totalCost: {
      type: Number,
      required: [true, "total price is required"],
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: [0, "Paid amount cannot be negative"],
    },

    dueAmount: {
      type: Number,
      default: 0,
      min: [0, "Due amount cannot be negative"],
    },

    changeAmount: {
      type: Number,
      default: 0,
      min: [0, "change amount cannot be negative"],
    },

    purchaseStatus: {
      type: String,
      enum: ["received", "ordered", "pending", "cancel"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "due", "partial"],
      required: true,
    },

    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PurchaseModel = mongoose.model("Purchase", schema);

module.exports = PurchaseModel;
