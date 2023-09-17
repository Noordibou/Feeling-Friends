const express = require('express');
const Student = require('../models/Student.js');

const app = express();

// ------------------- CRUD Routes for Student Only ------------------- //

// // Create a new student
app.post('/students', async (req, res) => {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
})

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