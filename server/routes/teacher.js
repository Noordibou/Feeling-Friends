const Student = require('../models/Student.js');
const Teacher = require('../models/Teacher.js');
const User = require('../models/User.js');
const {createNewTeacher, getAllTeachers, getTeacherById, updateTeacherInfo, deleteTeacher,  addStudentToClass, removeStudentFromClass, getClassBySubject, getStudentsInClassroom } = require('../controllers/teacherController.js')
const router = require("express").Router();

// probably won't use, use the signup instead
router.post('/teachers', createNewTeacher);
router.get('/teachers', getAllTeachers)
router.get('/teachers/:id', getTeacherById);
router.put("/teachers/:id", updateTeacherInfo);
router.delete('/teachers/:id', deleteTeacher);

router.get('/teachers/:id/classrooms/:classroomId', getClassBySubject);

router.get('/teachers/:id/classrooms/:classroomId/students', getStudentsInClassroom);
// Add this route to teacher.js


// ================================================== //
// DOESNT WORK YET add a student to a classroom
router.put('/teachers/:teacher_id/students/:student_id', addStudentToClass);

// DOESNT WORK YET get all students in classroom

// DOESNT WORK YET removes student from a classroom
router.delete('/teacher/:teacher_id/students/:student_id', removeStudentFromClass)


module.exports = router;
