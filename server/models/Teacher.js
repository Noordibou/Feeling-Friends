const mongoose = require("mongoose");


const teacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  prefix: { type: String },
  avatarImg: { type: String },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  classrooms: [{
    classroomName: { type: String },
    subject: { type: String },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  }],
});

module.exports = mongoose.model("Teacher", teacherSchema);