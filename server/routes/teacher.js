const Student = require('../models/Student.js');
const Teacher = require('../models/Teacher.js');
const router = require("express").Router();
const { createNewTeacher, getAllTeachers, getTeacherById, updateTeacherInfo, deleteTeacher } = require("../controllers/teacherController.js")

// probably won't use, use the signup instead
router.post('/teachers', createNewTeacher);
router.get('/teachers', getAllTeachers)
router.get('/teachers/:id', getTeacherById);
router.put("/teachers/:id", updateTeacherInfo);
router.delete('/teachers/:id', deleteTeacher);

// TODO: *** WILL NEED TO CHANGE *** //
// Adds a student to the teacher's classroom roster
router.put('/teachers/:teacher_id/students/:student_id', async (req, res) => {
  const teacher = await Teacher.findById(req.params.teacher_id);
  const student = await Student.findById(req.params.student_id);

  teacher.students.push(student._id);
  await teacher.save();
  res.json(teacher);
  
});

// TODO: *** WILL NEED TO CHANGE *** //
// Gets all students within a teacher's classroom
router.get('/teacher/:teacher_id/students', async (req, res) => {
  const teacher = await Teacher.findById(req.params.teacher_id);
  const students = await Student.find({ _id: { $in: teacher.students }});
  res.json(students)
})

// TODO: *** WILL NEED TO CHANGE *** //
// Deletes a student in a teacher's classroom
router.delete('/teacher/:teacher_id/students/:student_id', async (req, res) => {
  const teacher = await Teacher.findById(req.params.teacher_id);
  const student = await Student.findById(req.params.student_id);

  teacher.students = teacher.students.filter((student) => student.id !== student.id);
  await teacher.save();
  res.sendStatus(200);
})

module.exports = router;