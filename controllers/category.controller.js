const CategoryModel = require("../models/category.model");
const ProductModel = require("../models/product.model");

exports.create = async (req, res, next) => {
  try {
    const exist = await CategoryModel.findOne({ name: req.body.name });
    if (exist) {
      return res.status(409).json({ error: "name is already exist!" });
    }

    const doc = await CategoryModel.create(req.body)

    res.status(201).json({
      success: true,
      result: doc
    })
  } catch (error) {
    next(error);
  }
}






exports.findAll = async (req, res) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const querySearch = {};

    if (req.query.search) {
      querySearch["$or"] = [
        { name: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const docs = await CategoryModel.find(querySearch)
      .skip(skip)
      .limit(limit)
      .sort({_id: -1})
      .exec();

    const totalItem = await CategoryModel.find(querySearch).countDocuments();
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
    const doc = await CategoryModel.findOne({ _id: id });
    if (!doc) {
      return res.status(404).json({ error: "Category not found!" });
    }
    return res.status(200).json({
      success: true,
      result: doc,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doc = await CategoryModel.findByIdAndUpdate(id, req.body);

    if (!doc) {
      return res.status(404).json({ error: "Category not found!" });
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

    // Check if the category has any associated products
    const hasProducts = await ProductModel.exists({ categoryId: id });

    if (hasProducts) {
      return res
        .status(400)
        .json({
          error:
            "Category cannot be deleted because it has products associated with it.",
        });
    }

    const doc = await CategoryModel.findByIdAndDelete(id);

    if (!doc) {
      return res.status(404).json({ error: "Category not found!" });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
}
