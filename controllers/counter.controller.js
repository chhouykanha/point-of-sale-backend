const CounterModel = require("../models/counter.model");

exports.generateInvoiceNumber = async () =>  {
    const result = await CounterModel.findOneAndUpdate(
      { _id: 'invoiceNumber' }, 
      { $inc: { sequence_value: 1 } }, 
      { new: true, upsert: true }
    );
    const invoiceNumber = `inv-${String(result.sequence_value).padStart(4, '0')}`;
    return invoiceNumber
}

// Function to generate the next product code
exports.generateProductCode = async () => {
  
    const result = await CounterModel.findOneAndUpdate(
      { _id: 'productCode' }, 
      { $inc: { sequence_value: 1 } }, 
      { new: true, upsert: true } 
    );
  
    const productCode = `pro-${String(result.sequence_value).padStart(4, '0')}`;
    return productCode;
  }