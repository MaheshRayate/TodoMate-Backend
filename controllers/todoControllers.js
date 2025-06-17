const Todo = require("./../models/toDoModel");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllTodos = catchAsync(async (req, res, next) => {
  const todos = await Todo.find({ user: req.user.id });
  res.status(200).json({
    status: "success",
    data: {
      todos,
    },
  });
});

exports.createTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.create({ ...req.body, user: req.user.id });
  console.log(todo);

  res.status(201).json({
    status: "success",
    data: {
      todo,
    },
  });
});

exports.getTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.findOne({ user: req.user.id, _id: req.params.id });
  // const todo = await Todo.findById(req.params.id); //mongoose's method

  if (!todo) {
    return next(new AppError(`No todo item found with that ID`, 404));
  }
  // TodoItem.findOne({_id:req.params.id})
  res.status(200).json({
    status: "success",
    data: {
      todo,
    },
  });
});

exports.updateTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.findOne({ user: req.user.id, _id: req.params.id });

  // const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true, //returns the new document to the client
  //   runValidators: true, //validates all validators(validators will run again)
  // });
  if (!todo) {
    return next(new AppError(`No todo item found with that ID`, 404));
  }

  await todo.updateOne(req.body);

  res.status(200).json({
    status: "success",
    data: {
      todo,
    },
  });
});

exports.deleteTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.findOne({ user: req.user.id, _id: req.params.id });

  if (!todo) {
    return next(new AppError("No todo found with that id", 404));
  }

  await Todo.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
