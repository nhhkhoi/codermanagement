const { body, query } = require("express-validator");

const validateUserBody = [
  body("name")
    .exists()
    .withMessage("Missing name in request")
    .isString()
    .withMessage("Name must be String")
    .notEmpty()
    .withMessage("Name must not be empty")
    .escape(),
];

const validateUserQuery = [
  query("name")
    .if((value, { req }) => {
      req.query.name;
    })
    .isString()
    .withMessage("Name must be String")
    .escape(),
  query("role")
    .if((value, { req }) => {
      req.query.role;
    })
    .isString()
    .withMessage("Role must be String")
    .escape(),
];
const validateUserId = [
  body("id")
    .exists()
    .withMessage("Missing userId in request")
    .isString()
    .withMessage("UserId must be String")
    .notEmpty()
    .withMessage("UserId must not be empty")
    .escape(),
];

module.exports = { validateUserBody, validateUserId, validateUserQuery };
