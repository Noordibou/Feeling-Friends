const Student = require('../models/Student.js');
const Teacher = require('../models/Teacher.js');
const User = require('../models/User.js');
const {createNewTeacher, getAllTeachers, getTeacherById, updateTeacherInfo, deleteTeacher, getAllStudentsInClassroom, addStudentToClass, removeStudentFromClass } = require('../controllers/teacherController.js')
const router = require("express").Router();

// probably won't use, use the signup instead
router.post('/teachers', createNewTeacher);
router.get('/teachers', getAllTeachers)
router.get('/teachers/:id', getTeacherById);
router.put("/teachers/:id", updateTeacherInfo);
router.delete('/teachers/:id', deleteTeacher);

// ================================================== //
// DOESNT WORK YET add a student to a classroom
router.put('/teachers/:teacher_id/students/:student_id', addStudentToClass);

// DOESNT WORK YET get all students in classroom
router.get('/teacher/:teacher_id/students', getAllStudentsInClassroom)

// DOESNT WORK YET removes student from a classroom
router.delete('/teacher/:teacher_id/students/:student_id', removeStudentFromClass)

module.exports = router;
