const CustomerModel = require("../models/customer.model");

exports.create = async (req, res, next) => {
  try {
    const exist = await CustomerModel.findOne({ name: req.body.name });
    if (exist) {
      return res.status(409).json({ error: "name is already exist!" });
    }

    const doc = await CustomerModel.create(req.body);

    res.status(201).json({
      success: true,
      result: doc,
    });
  } catch (error) {
    next(error);
  }
};

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

    const docs = await CustomerModel.find(querySearch)
      .skip(skip)
      .limit(limit)
      .sort({_id: -1})
      .exec();

    const totalItem = await CustomerModel.find(querySearch).countDocuments();
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
    const doc = await CustomerModel.findOne({ _id: id });
    if (!doc) {
      return res.status(404).json({ error: "Customer not found!" });
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

    const doc = await CustomerModel.findByIdAndUpdate(id, req.body);

    if (!doc) {
      return res.status(404).json({ error: "Customer not found!" });
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

    const doc = await CustomerModel.findByIdAndDelete(id)

    if (!doc) {
      return res.status(404).json({ error: "Customer not found!" });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
