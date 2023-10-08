const mongoose = require("mongoose");


const teacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  prefix: { type: String },
  avatarImg: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  schoolTeacherId: { type: String },
  classrooms: [{
    classroomName: { type: String },
    subject: { type: String },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  }],
});

module.exports = mongoose.model("Teacher", teacherSchema);