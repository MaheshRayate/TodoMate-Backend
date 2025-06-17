const express = require("express");
const userRouter = require("./routes/userRoutes");
const todoRouter = require("./routes/toDoRoutes");
const globalErrorHandler = require("./controllers/errorControllers");
// const cors = require("cors");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend origin
    credentials: true, // allow cookies to be sent
  })
);

app.use(express.json());

app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1/users/", userRouter);
app.use("/api/v1/todos/", todoRouter);

// ERROR HANDLING MIDDLEWARE
// Accepts four arguement it is an error first middleware(first object that is accepted as an arguement is an error object)

app.use(globalErrorHandler);

module.exports = app;
