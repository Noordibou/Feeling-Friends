const express = require('express');
const Student = require('../models/Student.js');
const User = require('../models/User.js');

const app = express();

// ------------------- CRUD Routes for Student Only ------------------- //

// Create a new student
app.post('/students', async (req, res) => {
  try {
      // Create a new user first
      const user = new User({
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          role: 'student',
      });

      // Save the user
      await user.save();

      // Create a new student and associate it with the user
      const student = new Student({
          user: user._id,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          seatNumber: req.body.seatNumber,
          birthday: req.body.birthday,
          gradeYear: req.body.gradeYear,
          schoolStudentId: req.body.schoolStudentId,
          role: 'student',
          avatarImg: req.body.avatarImg,
          journalEntries: req.body.journalEntries,
      });

      await student.save();
      res.json(student);
  } catch (error) {
      res.status(400).json(error);
  }
});

// // Create a new student
// app.post('/students', async (req, res) => {
//     const student = new Student(req.body);
//     await student.save();
//     res.json(student);
// })

// // Gets all students registered (not for specific teacher/classroom)
app.get('/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
})

// Gets specific student
app.get("/students/:id", async (req, res) => {
    try {
      res.json(await Student.findById(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });

// Updates a specific student
app.put("/students/:id", async (req, res) => {
  try {
    res.json(
      await Student.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
      res.status(400).json(error);
  }
});

// delete a student
app.delete("/students/:id", async (req, res) => {
  try {
    res.json(await Student.findByIdAndRemove(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});


module.exports = app;