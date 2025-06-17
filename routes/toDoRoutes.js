const express = require("express");
const todoControllers = require("./../controllers/todoControllers");
const authControllers = require("./../controllers/authControllers");

const router = express.Router();

router
  .route("/")
  .get(authControllers.protect, todoControllers.getAllTodos)
  .post(authControllers.protect, todoControllers.createTodo);

router
  .route("/:id")
  .get(authControllers.protect, todoControllers.getTodo)
  .patch(authControllers.protect, todoControllers.updateTodo)
  .delete(authControllers.protect, todoControllers.deleteTodo);

module.exports = router;
