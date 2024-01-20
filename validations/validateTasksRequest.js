const { body, query, param } = require("express-validator");

const validateTaskName = [
  body("name")
    .exists()
    .withMessage("Missing task name in request")
    .isString()
    .withMessage("Name must be String")
    .notEmpty()
    .withMessage("Name must not be empty")
    .escape(),
];

const validateTaskQuery = [
  query("name")
    .if((value, { req }) => {
      req.query.name;
    })
    .isString()
    .withMessage("Name must be String")
    .escape(),
  query("status")
    .if((value, { req }) => {
      req.query.status;
    })
    .isString()
    .withMessage("Status must be String")
    .escape(),
];
const validateAssignedTask = [
  body("id")
    .if((value, { req }) => {
      req.body.id;
    })
    .exists()
    .withMessage("Missing userId in request")
    .isString()
    .withMessage("UserId must be String")
    .notEmpty()
    .withMessage("UserId must not be empty")
    .escape(),
  param("id")
    .if((value, { req }) => {
      req.params.id;
    })
    .exists()
    .withMessage("Missing taskId in request")
    .isString()
    .withMessage("TaskId must be String")
    .notEmpty()
    .withMessage("TaskId must not be empty")
    .escape(),
];

const validateTaskStatus = [
  param("id")
    .exists()
    .withMessage("Missing taskId in request")
    .isString()
    .withMessage("TaskId must be String")
    .notEmpty()
    .withMessage("TaskId must not be empty")
    .escape(),

  body("status")
    .exists()
    .withMessage("Missing task status in request")
    .isString()
    .withMessage("Task status must be String")
    .notEmpty()
    .withMessage("Task status must not be empty")
    .escape(),
];

const validateDeletedTask = [
  param("id")
    .exists()
    .withMessage("Missing taskId in request")
    .isString()
    .withMessage("TaskId must be String")
    .notEmpty()
    .withMessage("TaskId must not be empty")
    .escape(),
];
module.exports = {
  validateTaskName,
  validateAssignedTask,
  validateTaskQuery,
  validateTaskStatus,
  validateDeletedTask,
};
