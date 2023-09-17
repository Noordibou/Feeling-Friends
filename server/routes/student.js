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

// // FOR TEACHER Gets all students
app.get('/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
})

app.get("/students/:id", async (req, res) => {
    try {
      res.json(await Student.findById(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });

// update a student
app.put('/students/:student_id', async (req, res) => {
    const student = await Student.findById(req.params.student_id);
    student.set(req.body);
    await student.save();
    res.json(student);
})

// delete a student
app.delete('/students/:student_id', async (req, res) => {
    const student = await Student.findById(req.params.student_id)
    await Student.deleteOne();
    res.json({ message: 'Student deleted.'});
})


module.exports = app;