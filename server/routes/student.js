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
          email: req.body.email, // You can use email from req.body or any other user-related fields
          username: req.body.username, // You can use username from req.body or any other user-related fields
          password: req.body.password, // You can use password from req.body or any other user-related fields
          role: 'student', // Assuming you want to create a student user
      });

      // Save the user
      await user.save();

      // Create a new student and associate it with the user
      const student = new Student({
          user: user._id, // Associate the student with the user using the user's ObjectId
          firstName: req.body.firstName, // You can use firstName from req.body or any other student-related fields
          lastName: req.body.lastName, // You can use lastName from req.body or any other student-related fields
          seatNumber: req.body.seatNumber, // Include seatNumber from req.body
          birthday: req.body.birthday, // Include birthday from req.body
          gradeYear: req.body.gradeYear, // Include gradeYear from req.body
          schoolStudentId: req.body.schoolStudentId, // Include schoolStudentId from req.body
          role: 'student', // Include role (if not already set in req.body)
          avatarImg: req.body.avatarImg, // Include avatarImg from req.body
          journalEntries: req.body.journalEntries, // Include journalEntries from req.body
      });

      // Save the student
      await student.save();

      // Return the newly created student object in the response
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