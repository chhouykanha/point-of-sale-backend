const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'name is required']
    },
    phone: {
        type: String
    },
    address: {
        type: String
    }
}, {
    timestamps: true
})

const CustomerModel = mongoose.model('Customer', schema)

module.exports = CustomerModel