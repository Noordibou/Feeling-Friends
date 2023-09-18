const express = require('express');
const Student = require('../models/Student.js');
const Teacher = require('../models/Teacher.js');
// const User = require('../models/User.js');


const app = express();

// Create a new teacher
app.post('/teachers', async (req, res) => {
  try {
      // Create a new user first
      const user = new User({
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          role: 'teacher',
      });

      // Save the user
      await user.save();

      // Create a new teacher and associate it with the user
      const teacher = new Teacher({
          user: user._id,
          prefix: req.body.prefix,
          avatarImg: req.body.avatarImg,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          classrooms: req.body.classrooms, // Include classrooms from req.body
         
      });

      // Save the teacher
      await teacher.save();

      // Return the newly created teacher object in the response
      res.json(teacher);
  } catch (error) {
      res.status(400).json(error);
  }
});


// Create new teacher
// app.post('/teachers', async (req, res) => {
//   const teacher = new Teacher(req.body);
//   await teacher.save();
//   res.json(teacher);
// })

// Gets all teachers
app.get('/teachers', async (req, res) => {
  const teacher = await Teacher.find();
  res.json(teacher);
})

// Get specific teacher (new)
// app.get('/teachers/:id', async (req, res) => {
//   try {
//       res.json(await Teacher.findById(req.params.id));
//   } catch (error) {
//       res.status(400).json(error);
//   }
// });

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

// Delete a teacher
app.delete('/teachers/:id', async (req, res) => {
  try {
      res.json(await Teacher.findByIdAndRemove(req.params.id));
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