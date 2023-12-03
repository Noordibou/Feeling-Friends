const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  prefix: { type: String },
  avatarImg: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  schoolTeacherId: { type: String },
  classrooms: [
    {
      classSubject: { type: String },
      location: { type: String },
      furniture: [
        {
          name: {
            type: String,
            enum: [
              "Smartboard",
              "Teacher's Desk",
              "Door",
              "Window",
              "Empty Desk",
              "Table",
              "Bookcase/Storage",
              "Chalkboard"
            ],
          },
          x: { type: Number, default: null },
          y: { type: Number, default: null },
          assigned: { type: Boolean, default: false },
        },
      ],
      students: [
        {
          student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
          seatInfo: {
            x: { type: Number, default: null },
            y: { type: Number, default: null },
            assigned: { type: Boolean, default: false },
          },
          _id: false,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Teacher", teacherSchema);
