const express = require('express');
const Student = require('../models/Student.js');

const app = express();

// CRUD Routes for Student Only
// // Create a new student

app.post('/students', async (req, res) => {
    const student = new Student(req.body);

    await student.save();

    res.json(student);
})


// CRUD Routes for Teacher Only

// // Gets all students
app.get('/students', async (req, res) => {
    const students = await Student.find();

    res.json(students);
})

module.exports = app;