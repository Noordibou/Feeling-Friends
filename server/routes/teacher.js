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

app.get('/teachers', async (req, res) => {
  const teacher = await Teacher.find();
  res.json(teacher);
})

// get specific teacher
app.get('/teachers/:id', async (req, res) => {
  const teacher = await Teacher.find();
  res.json(teacher);

})

app.put("/students/:id", async (req, res) => {
    try {
      res.json(
        await Student.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      res.status(400).json(error);
    }
  });


  app.put("/teachers/:id", async (req, res) => {
    try {
      res.json(
        await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      res.status(400).json(error);
    }
  });


  // Adds a student to the teacher's classroom roster & updates student information
  app.put('/teachers/:teacher_id/students/:student_id', async (req, res) => {
    const teacher = await Teacher.findById(req.params.teacher_id);
    const student = await Student.findById(req.params.student_id);
  
    if (!req.body) {
      // Add the student to the teacher's students array
      teacher.students.push(student._id);

      // Save the teacher's changes
      await teacher.save();

      // Respond with a success message
      res.json(teacher);
    } else if (req.body) {
      // Update the student's information with the data from the request body
      student.set(req.body);

      await student.save();

      res.json(student);
    }
  });

  app.get('/teacher/:teacher_id/students', async (req, res) => {
    const teacher = await Teacher.findById(req.params.teacher_id);
    const students = await Student.find({ _id: { $in: teacher.students }});
    res.json(students)
  })

  app.delete("/students/:id", async (req, res) => {
    try {
      res.json(await Student.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });

  app.delete('/teacher/:teacher_id/students/:student_id', async (req, res) => {
    const teacher = await Teacher.findById(req.params.teacher_id);
    const student = await Student.findById(req.params.student_id);

    teacher.students = teacher.students.filter((student) => student.id !== student.id);
    await teacher.save();
    res.sendStatus(200);
  })

  



module.exports = app;