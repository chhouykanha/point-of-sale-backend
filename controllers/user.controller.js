const UserModel = require("../models/user.model");
const bcrypt = require('bcrypt')

exports.findAll = async (req, res, next) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const querySearch = {};

    if (req.query.search) {
      querySearch["$or"] = [
        { username: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const docs = await UserModel.find({
      ...querySearch,
      role: { $ne: "super" },
      email: { $ne: req.user.email },
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .exec();

    const totalItem = await UserModel.find({
      ...querySearch,
      role: { $ne: "super" },
    }).countDocuments();
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
    const doc = await UserModel.findOne({ _id: id });
    if (!doc) {
      return res.status(404).json({ error: "User not found!" });
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
    const { role, password } = req.body;
    let hashed = ""
    // Check if the user is attempting to create an admin
    if (req.user.role !== "super" && role === "admin") {
      return res
        .status(403)
        .json({ error: "Only super users can create admin accounts" });
    }

    if(password){
       hashed = await bcrypt.hash(password, 10)
       req.body.password = hashed
    }

    const doc = await UserModel.findByIdAndUpdate(id, req.body);

    if (!doc) {
      return res.status(404).json({ error: "User not found!" });
    }

    return res.status(200).json({
      success: true,
      result: doc,
    });
  } catch (error) {
    next(error);
  }
}

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role: requesterRole } = req.user;

    // Find the user document by ID
    const doc = await UserModel.findById(id);

    // If the user is not found
    if (!doc) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Prevent deletion of a "super" user
    if (doc.role === "super") {
      return res.status(400).json({
        success: false,
        error: "You cannot delete this user!",
      });
    }

    // Prevent deletion of an "admin" user unless the requester is a "super"
    if (doc.role === "admin" && requesterRole !== "super") {
      return res.status(403).json({
        success: false,
        error: "You don't have permission to delete this user!",
      });
    }

    // Proceed with deletion
    await doc.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
