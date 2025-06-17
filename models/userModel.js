const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User should have name"],
  },

  email: {
    type: String,
    required: [true, "User should have email"],
    unique: [true, "This email is already registered with us"],
    lowercase: true,
  },

  password: {
    type: String,
    required: [true, "Enter your password"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE & SAVE
      validator: function (el) {
        return this.password === el;
      },
      message: "Password does not match with Password Confirm",
    },
  },

  passwordChangedAt: Date,
});

// Document middleware for hashing the password
userSchema.pre("save", async function (next) {
  console.log("Password will be Hashed😄😄");

  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance Methods
// For checking if the password in body is same as password in the DB
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(JWTTimestamp, passwordChangedTimestamp);
    //   If the password was changed after the token was created then return true
    return JWTTimestamp < passwordChangedTimestamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
