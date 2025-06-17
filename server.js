const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");


dotenv.config({ path: "./config.env" });



mongoose
  .connect(process.env.DATABASE_STRING)
  .then((con) => {
    console.log("DB Connection Successfull");
  })
  .catch((err) => {
    console.log("Error connecting the DB", err);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server running on port 3000");
});
