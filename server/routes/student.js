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

// Updates a specific student's journal entry
app.put("/students/:id", async (req, res) => {
  const currentDate = new Date();

  // Get the current date as a string in the format "YYYY-MM-DD"
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(currentDate.getDate()).padStart(2, '0');

  const todayDate = `${month}-${day}-${year}`;

  try {
    const studentId = req.params.id;
    const journalEntry = {
      date: req.body.todayDate, // Assuming you want to add the current date
      checkin: {
        emotion: req.body.emotion,
        ZOR: req.body.ZOR,
        goal: req.body.goal,
        need: req.body.need,
        present: req.body.present,
      },
      checkout: {
        emotion: req.body.emotion, // You may need to adjust this based on your requirements
        ZOR: req.body.ZOR, // You may need to adjust this based on your requirements
        goal: req.body.goal, // You may need to adjust this based on your requirements
        need: req.body.need, // You may need to adjust this based on your requirements
        highlight: req.body.highlight, // You may need to adjust this based on your requirements
      },
    };

    // Update the student's journal entries using $push
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        $push: { journalEntries: journalEntry },
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student journal entries:", error);
    res.status(500).json({ message: "Internal server error" });
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