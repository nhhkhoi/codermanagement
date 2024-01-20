const express = require("express");
const { body } = require("express-validator");
const {
  createTask,
  getAllTasks,
  getSingleTask,
  assignTaskToUser,
  unassignTaskFromUser,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/tasks.controller");

const {
  validateTaskName,
  validateAssignedTask,
  validateTaskQuery,
  validateTaskStatus,
  validateDeletedTask,
} = require("../validations/validateTasksRequest");
const router = express.Router();

/* 
  @routes POST api/tasks
  @description create new task
  @access private, manager
  @required body: task name
*/
router.post("/", validateTaskName, createTask);

/* 
  @routes GET api/tasks
  @description get all tasks with sort options
  @access private
*/
router.get("/", validateTaskQuery, getAllTasks);

/* 
  @routes GET api/tasks/:id
  @description get specific task
  @access public
*/
router.get("/:id", validateTaskQuery, getSingleTask);

/* 
  @routes PUT api/tasks/:id/assign
  @description assign task to user
  @access private, manager
  @required body: user id
*/
router.put("/:id/assign", validateAssignedTask, assignTaskToUser);

/* 
  @routes PUT api/tasks/:id/unassign
  @description unassign task from user
  @access private, manager
  
*/
router.put("/:id/unassign", validateAssignedTask, unassignTaskFromUser);

/* 
  @routes PUT api/task/:id/status
  @description update task status
  @access private
*/
router.put("/:id/status", validateTaskStatus, updateTaskStatus);

/* 
 @routes DELETE api/tasks/:id
  @description soft delete task
  @access private, manager
*/
router.delete("/:id", validateDeletedTask, deleteTask);

module.exports = router;
