const { default: mongoose} = require("mongoose");

const schema = new mongoose.Schema({
    productName: {
        type: String, 
        required: true
    },
    code : {
        type: String,
        required: true
    },
    salePrice: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

const Label = mongoose.model('Label', schema)
module.exports = Label