const express = require("express");
const Routes = express.Router();
const taskController = require("../controller/task.controller");

Routes.post("/get-task", taskController.getTask);

Routes.post("/get-task-uid", taskController.getTaskbyUid);

Routes.get("/get-all-task", taskController.getAllTask);

Routes.get("/get-limited-task", taskController.getLimitedTask);

Routes.post("/add-task", taskController.addTask);

Routes.post("/task-delete", taskController.deleteTask);

Routes.post("/task-status-change", taskController.statusChange);

Routes.post("/task-search", taskController.getsearchtask);

Routes.post("/task-search-data", taskController.getsearchtaskbyName);

Routes.post("/task-search-email-data", taskController.getTaskByFilterEmail);

module.exports = Routes;
