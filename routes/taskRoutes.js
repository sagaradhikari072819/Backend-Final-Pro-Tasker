const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const Task = require("../models/Task");
const Project = require("../models/Project");
const {
  getTasks,
  updateTask,
  deleteTask,
  createTask,
  getTaskById,
} = require("../controllers/taskController");

const taskRouter = express.Router();

// Protects all rotes in this router
taskRouter.use(authMiddleware);

taskRouter.get("/:projectId/tasks", getTasks);

taskRouter.post("/:projectId/tasks", createTask);

taskRouter.put("/:projectId/tasks/:taskId", updateTask);

taskRouter.delete("/:projectId/tasks/:taskId", deleteTask);

taskRouter.get("/:projectId/tasks/:taskId", getTaskById);

module.exports = taskRouter;
