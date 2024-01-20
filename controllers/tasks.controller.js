const mongoose = require("mongoose");
const User = require("../models/users.model.js");
const Task = require("../models/tasks.model.js");
const { sendResponse, AppError } = require("../helpers/utils.js");
const { validationResult } = require("express-validator");
const tasksController = {};

tasksController.createTask = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const message = result.array()[0].msg;
      const err = new AppError(422, message, "Validation Error");
      throw err;
    }

    const newTaskInfo = req.body;

    const newTask = await Task.create(newTaskInfo);
    sendResponse(
      res,
      200,
      true,
      { newTask },
      null,
      "New task created sucessfully"
    );
  } catch (err) {
    next(err);
  }
};

tasksController.getAllTasks = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const message = result.array()[0].msg;
      const err = new AppError(422, message, "Validation Error");
      throw err;
    }
    const taskPerPage = 10;
    const { name, status, createdAt = 1, updatedAt = 1, page = 1 } = req.query;

    const filter = {
      ...(name && { name }),
      ...(status && { status }),
      isDeleted: false,
    };

    // Sort options with 1 for ascending, -1 for descending
    const options = {
      _id: 1,
      ...(createdAt && { createdAt }),
      ...(updatedAt && { updatedAt }),
    };

    const filteredTask = await Task.find(filter)
      .sort(options)
      .skip(page > 0 ? (page - 1) * taskPerPage : 0)
      .limit(taskPerPage);

    sendResponse(
      res,
      200,
      true,
      { filteredTask },
      null,
      "All task matched retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

tasksController.getSingleTask = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const message = result.array()[0].msg;
      const err = new AppError(422, message, "Validation Error");
      throw err;
    }

    const foundedTaskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(foundedTaskId)) {
      const err = new AppError(
        422,
        "TaskId is not a valid ObjectId string",
        "Validation Error"
      );
      throw err;
    }
    const foundedTaskObjectId = new mongoose.Types.ObjectId(foundedTaskId);

    const foundedTask = await Task.find({ _id: foundedTaskObjectId });

    sendResponse(
      res,
      200,
      true,
      { foundedTask },
      null,
      "Task founded successfully"
    );
  } catch (err) {
    next(err);
  }
};

tasksController.assignTaskToUser = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const message = result.array()[0].msg;
      const err = new AppError(422, message, "Validation Error");
      throw err;
    }

    const assigneeId = req.body.id;
    if (!mongoose.Types.ObjectId.isValid(assigneeId)) {
      const err = new AppError(
        422,
        "UserId is not a valid ObjectId string",
        "Validation Error"
      );
      throw err;
    }
    const assigneeObjectId = new mongoose.Types.ObjectId(assigneeId);

    const assigneeInfo = await User.findOne({ _id: assigneeObjectId });

    const assignedTaskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(assignedTaskId)) {
      const err = new AppError(
        422,
        "UserId is not a valid ObjectId string",
        "Validation Error"
      );
      throw err;
    }
    const assignedTaskObjectId = new mongoose.Types.ObjectId(assignedTaskId);

    const assignedTask = await Task.findOneAndUpdate(
      { _id: assignedTaskObjectId },
      { assignedTo: assigneeInfo },
      { new: true }
    );
    sendResponse(
      res,
      200,
      true,
      { assignedTask },
      null,
      "Task assigned sucessfully"
    );
  } catch (err) {
    next(err);
  }
};

tasksController.unassignTaskFromUser = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const message = result.array()[0].msg;
      const err = new AppError(422, message, "Validation Error");
      throw err;
    }

    const unassignedTaskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(unassignedTaskId)) {
      const err = new AppError(
        422,
        "UserId is not a valid ObjectId string",
        "Validation Error"
      );
      throw err;
    }
    const unassignedTaskObjectId = new mongoose.Types.ObjectId(
      unassignedTaskId
    );

    const unassignedTask = await Task.findOneAndUpdate(
      { _id: unassignedTaskObjectId },
      { assignedTo: null },
      { new: true }
    );

    sendResponse(
      res,
      200,
      true,
      { unassignedTask },
      null,
      "Task unassigned sucessfully"
    );
  } catch (err) {
    next(err);
  }
};

tasksController.updateTaskStatus = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const message = result.array()[0].msg;
      const err = new AppError(422, message, "Validation Error");
      throw err;
    }

    const updatedTaskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(updatedTaskId)) {
      const err = new AppError(
        422,
        "TaskId is not a valid ObjectId string",
        "Validation Error"
      );
      throw err;
    }
    const updatedTaskObjectId = new mongoose.Types.ObjectId(updatedTaskId);

    const newTaskStatus = req.body.status;

    const updatedTask = await Task.findOne({ _id: updatedTaskObjectId });

    if (updatedTask.status === "Done" && newTaskStatus !== "Archived") {
      const err = new AppError(
        422,
        "Status can only be changed to Archived",
        "Validation Error"
      );
      throw err;
    }

    const updatedTaskStatus = await Task.findOneAndUpdate(
      { _id: updatedTaskObjectId },
      { status: newTaskStatus },
      {
        new: true,
      }
    );
    sendResponse(
      res,
      200,
      true,
      { updatedTaskStatus },
      null,
      "Task status updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

tasksController.deleteTask = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const message = result.array()[0].msg;
      const err = new AppError(422, message, "Validation Error");
      throw err;
    }
    const deletedTaskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(deletedTaskId)) {
      const err = new AppError(
        422,
        "TaskId is not a valid ObjectId string",
        "Validation Error"
      );
      throw err;
    }
    const deletedTaskObjectId = new mongoose.Types.ObjectId(deletedTaskId);

    const deletedTask = await Task.findOneAndUpdate(
      { _id: deletedTaskObjectId },
      { isDeleted: true },
      { new: true }
    );
    sendResponse(
      res,
      200,
      true,
      { data: deletedTask },
      null,
      "Task deleted sucessfully"
    );
  } catch (err) {
    next(err);
  }
};

module.exports = tasksController;
