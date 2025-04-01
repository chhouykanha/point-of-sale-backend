const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
    businessName: {
        type: String,
        unique: true,
        required: [true, 'business name is required']
    },
    name: {
        type: String,
        required: [true, 'name is require']      
    },

    phone: {
        type: String,
        required: [true, 'phone is require']
    },

    address: {
        type: String,
        required: [true, 'address is require']
    },
    note: {
        type: String
    }
},{
    timestamps: true
})

const SupplyModel = mongoose.model('Supply', schema)

module.exports = SupplyModel
