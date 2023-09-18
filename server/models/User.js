const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 
const Student = require("./Student.js");
const Teacher = require("./Teacher.js");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  role: {
    type: String,
    enum: ["student", "teacher"],
    default: "student",
    required: true,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Student
  },
  
  teacher: {
   type: mongoose.Schema.Types.ObjectId,
   ref: Teacher
  }
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema);
