const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'name is require']
    },
    note: {
        type: String,
    },
}, {
    timestamps: true
})


const CategoryModel = mongoose.model('Category', schema)
module.exports = CategoryModel
