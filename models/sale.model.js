const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user is required']
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: [true, 'customer is required']
    },

    invoiceNumber: {
        type: String,
        unique: true,
        required: [true, 'invoice number is required']
    },

    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true},
            unitPrice: { type: Number, required: true },
            totalPrice: {type: Number, required: true},
        },
    ],

    totalCost: {
        type: Number,
        min: [0, "total cost cannot be negative"],
        required: [true, 'total cost is required']
    },

    paidAmount: {
        type: Number,
        default: 0,
        min: [0, "Paid amount cannot be negative"],
    },
  
    dueAmount: {
        type: Number,
        default: 0,
        min: [0, "Due amount cannot be negative"]
    },

    changeAmount: {
        type: Number,
        default: 0,
        min: [0, "change amount cannot be negative"]
    },
          
    paymentStatus: {
        type: String,
        enum: ["paid", "due", "partial"],
        required: true
    },
},{
    timestamps: true
})

const SaleModel = mongoose.model('Sale', schema)

module.exports = SaleModel
