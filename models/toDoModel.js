const mongoose = require("mongoose");

const toDoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "An item should have a title"],
  },

  description: {
    type: String,
    required: [true, "An item should have description"],
  },

  isCompleted: {
    type: "Boolean",
    default: false,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A todo must belong to a User"],
  },
});

const Todo = mongoose.model("Todo", toDoSchema);

module.exports = Todo;
