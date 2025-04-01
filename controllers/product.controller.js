const ProductModel = require("../models/product.model");
const { generateProductCode } = require("./counter.controller");

exports.create = async (req, res, next) => {
  try {
    
    const code = await generateProductCode()

    const doc = await ProductModel.create({...req.body, code});

    res.status(201).json({
      success: true,
      result: doc,
    });
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const querySearch = {};
    let sortOption = ""

    // advance filtering
    const reservedFields = ['page', 'limit', 'sort', 'search'];
    const queryFilters = { ...req.query };
 
    reservedFields.forEach((field) => delete queryFilters[field]);
 
     // Handle advanced filters (e.g., gte, lte, etc.)
    const filterString = JSON.stringify(queryFilters).replace(
       /\b(gte|gt|lte|lt|in)\b/g,
       (match) => `$${match}`
    );
    const filters = JSON.parse(filterString);

    // search 
    if (req.query.search) {
      querySearch["$or"] = [
        { name: { $regex: req.query.search, $options: "i" } },
        { code: { $regex: req.query.search, $options: "i" } },
      ];
    }
    
    // sort
    if(req.query.sort){
      sortOption = req.query.sort
    }else{
      sortOption = "-_id"
    }
    console.log({ ...querySearch ,...filters})
    const docs = await ProductModel.find({...querySearch, ...filters})
      .skip(skip)
      .limit(limit)
      .sort(sortOption)
      .populate('category', 'name note')
      .exec();

    const totalItem = await ProductModel.find(querySearch).countDocuments();
    const totalPage = Math.ceil(totalItem / limit);

    res.status(201).json({
      success: true,
      totalPage,
      result: docs,
    });
  } catch (error) {
    next(error);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const doc = await ProductModel.findOne({ _id: id }).populate('category', 'name note');
    if (!doc) {
      return res.status(404).json({ error: "Product not found!" });
    }

    return res.status(200).json({
      success: true,
      result: doc,
    })
  } catch (error) {
    next(error);
  }
};

exports.findOneByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    
    const doc = await ProductModel.findOne({ code }).populate('category', 'name note');
    if (!doc) {
      return res.status(404).json({ error: "Product not found!" });
    }

    return res.status(200).json({
      success: true,
      result: doc,
    })
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doc = await ProductModel.findByIdAndUpdate(id, req.body)

    if (!doc) {
      return res.status(404).json({ error: "Product not found!" })
    }

    return res.status(200).json({
      success: true,
      result: doc,
    });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doc = await ProductModel.findByIdAndDelete(id);

    if (!doc) {
      return res.status(404).json({ error: "Category not found!" });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
