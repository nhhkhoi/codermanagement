const express = require("express");
const router = express.Router();

const usersAPI = require("./users.api");
const tasksAPI = require("./tasks.api");

router.use("/users", usersAPI);
router.use("/tasks", tasksAPI);

module.exports = router;
