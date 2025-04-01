const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
    _id: String,
    sequence_value: Number,
});
  
const CounterModel = mongoose.model('Counter', schema);

module.exports = CounterModel
