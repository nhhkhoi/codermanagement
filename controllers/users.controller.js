const mongoose = require("mongoose");
const User = require("../models/users.model.js");
const Task = require("../models/tasks.model.js");
const { sendResponse, AppError } = require("../helpers/utils.js");
const { validationResult } = require("express-validator");
const usersController = {};

usersController.createUser = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const message = result.array()[0].msg;
      const err = new AppError(422, message, "Validation Error");
      throw err;
    }
    const newUserInfo = req.body;
    const newUser = await User.create(newUserInfo);

    sendResponse(
      res,
      200,
      true,
      { newUser },
      null,
      "New user created successfully"
    );
  } catch (err) {
    next(err);
  }
};

usersController.getAllUsers = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const message = result.array()[0].msg;
      const err = new AppError(422, message, "Validation Error");
      throw err;
    }

    const page = req.query.page || 1;
    const userPerPage = 10;

    const { name, role } = req.query;
    const filter = { ...(name && { name }), ...(role && { role }) };

    const filteredUsers = await User.find(filter)
      .sort({ _id: 1 })
      .skip(page > 0 ? (page - 1) * userPerPage : 0)
      .limit(userPerPage);

    sendResponse(
      res,
      200,
      true,
      { filteredUsers },
      null,
      "All user data that matched has been successfully retrieved."
    );
  } catch (err) {
    next(err);
  }
};

usersController.getSingleUser = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const message = result.array()[0].msg;
      const err = new AppError(422, message, "Validation Error");
      throw err;
    }

    const foundedUserId = req.body.id;

    if (!mongoose.Types.ObjectId.isValid(foundedUserId)) {
      const err = new AppError(
        422,
        "UserId is not a valid ObjectId string",
        "Validation Error"
      );
      throw err;
    }
    const foundedUserObjectId = new mongoose.Types.ObjectId(foundedUserId);
    const foundedUser = await User.find({ _id: foundedUserObjectId });

    sendResponse(
      res,
      200,
      true,
      { foundedUser },
      null,
      "User found sucessfully"
    );
  } catch (err) {
    next(err);
  }
};

usersController.getAllTasksSingleUser = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const message = result.array()[0].msg;
      const err = new AppError(422, message, "Validation Error");
      throw err;
    }

    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const err = new AppError(
        422,
        "UserId is not a valid ObjectId string",
        "Validation Error"
      );
      throw err;
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const UserTaskList = await Task.find({ assignTo: userObjectId });
    sendResponse(
      res,
      200,
      true,
      { UserTaskList },
      null,
      "Get user task list sucessfully"
    );
  } catch (err) {
    next(err);
  }
};

module.exports = usersController;
