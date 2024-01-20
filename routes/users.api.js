const express = require("express");
const { body, query } = require("express-validator");
const {
  validateUserBody,
  validateUserQuery,
  validateUserId,
} = require("../validations/validateUsersRequest");
const {
  createUser,
  getAllTasksSingleUser,
  getAllUsers,
  getSingleUser,
} = require("../controllers/users.controller");
const router = express.Router();

/*
  @routes POST api/users
  @description create a new user  
  @access private, manager
  @required body: name 
*/
router.post("/", validateUserBody, createUser);

/*
  @routes GET api/users
  @description get all users
  @access private
*/
router.get("/", validateUserQuery, getAllUsers);

/*
  @routes GET api/users/search
  @description get single user by name
  @access public
*/
router.get("/search", validateUserId, getSingleUser);

/*
  @routes GET api/users/:id/tasks
  @description get all tasks of specific user
  @access public
*/
router.get("/:id/tasks", validateUserId, getAllTasksSingleUser);

module.exports = router;
