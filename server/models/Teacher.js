const mongoose = require("mongoose");
const User = require('./User.js');
const Student = require('./Student.js');

const teacherSchema = new mongoose.Schema({
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  prefix: { type: String },
  avatarImg: { type: String },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});

module.exports = mongoose.model("Teacher", teacherSchema);