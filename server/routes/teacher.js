const express = require('express');
const Student = require('../models/Student.js');
const Teacher = require('../models/Teacher.js');

const app = express();


// Create new teacher
app.post('/teachers', async (req, res) => {
  const teacher = new Teacher(req.body);
  await teacher.save();
  res.json(teacher);
})

// Gets all teachers
app.get('/teachers', async (req, res) => {
  const teacher = await Teacher.find();
  res.json(teacher);
})

// get specific teacher
app.get('/teachers/:id', async (req, res) => {
  const teacher = await Teacher.find();
  res.json(teacher);

})

// Updates teacher info
app.put("/teachers/:id", async (req, res) => {
  try {
    res.json(
      await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json(error);
  }
});

// TODO: *** WILL NEED TO CHANGE *** //
// Adds a student to the teacher's classroom roster
app.put('/teachers/:teacher_id/students/:student_id', async (req, res) => {
  const teacher = await Teacher.findById(req.params.teacher_id);
  const student = await Student.findById(req.params.student_id);

  teacher.students.push(student._id);
  await teacher.save();
  res.json(teacher);
  
});

// TODO: *** WILL NEED TO CHANGE *** //
// Gets all students within a teacher's classroom
app.get('/teacher/:teacher_id/students', async (req, res) => {
  const teacher = await Teacher.findById(req.params.teacher_id);
  const students = await Student.find({ _id: { $in: teacher.students }});
  res.json(students)
})

// TODO: *** WILL NEED TO CHANGE *** //
// Deletes a student in a teacher's classroom
app.delete('/teacher/:teacher_id/students/:student_id', async (req, res) => {
  const teacher = await Teacher.findById(req.params.teacher_id);
  const student = await Student.findById(req.params.student_id);

  teacher.students = teacher.students.filter((student) => student.id !== student.id);
  await teacher.save();
  res.sendStatus(200);
})

module.exports = app;