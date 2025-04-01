const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is require"],
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "category is required"],
    ref: "Category",
  },

  code: {
    type: String,
    unique: true,
    required: [true, "code is require"],
  },

  imageUrl: {
    type: String,
    required: true,
  },

  costPrice: {
    type: Number,
    required: [true, "cost price is require"],
  },

  salePrice: {
    type: Number,
    required: [true, "sale price is require"],
  },

  currentStock: {
    type: Number,
    min: [0, "Current stock must be greater than or equal to zero"],
    default: 0,
  },

  note: {
    type: String,
  },
});

const ProductModel = mongoose.model("Product", schema);

module.exports = ProductModel;
