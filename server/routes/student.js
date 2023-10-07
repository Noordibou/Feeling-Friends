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

  // Get the current date as a string
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(currentDate.getDate()).padStart(2, '0');

  const todayDate = `${month}-${day}-${year}`;

  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const todayDateExists = student.journalEntries.findIndex(
      (entry) => entry.date === todayDate
    );

    const journalEntry = {
      date: todayDate,
      [todayDateExists !== -1 ? "checkout" : "checkin"]: {
        emotion: req.body.emotion,
        ZOR: req.body.ZOR,
        goal: req.body.goal,
        need: req.body.need,
        present: req.body.present,
      },
    };

    if (todayDateExists !== -1) {
      const entryIndex = todayDateExists;
      if (!student.journalEntries[entryIndex].checkout) {
        student.journalEntries[entryIndex].checkout = {};
      }
      student.journalEntries[entryIndex].checkout = {
        ...student.journalEntries[entryIndex].checkout,
        ...journalEntry.checkout,
      };
    } else {
      student.journalEntries.push(journalEntry);
    }

    // FIXME: No current way to catch if student enters the checkin/out more than two times. Find a way maybe on the home screen if they've already done all their checks for the day..?
    await student.save();

    res.json(student);
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