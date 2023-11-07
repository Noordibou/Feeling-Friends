const { verifyToken, verifyUser, verifyRole } = require('../middleware/index')
const router = require("express").Router();
const {
    createNewTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacherInfo,
    deleteTeacher,
    getClassBySubject,
    getStudentsInClassroom,
    getStudentProfileForTeacher,
    getAllStudentsForTeacher,
    editStudentInformation,
    deleteStudentInClassroom,
    addStudentToClassroom,
    deleteClassroom,
    createClassroom,
    updateStudentSeats
} = require('../controllers/teacherController.js');

// probably won't use, use the signup instead
router.post('/teachers', createNewTeacher);
router.get('/teachers', getAllTeachers)
router.get('/teachers/:id', verifyToken, verifyUser, verifyRole(["teacher"]), getTeacherById);
router.put("/teachers/:id", verifyToken, verifyUser, updateTeacherInfo);
router.delete('/teachers/:id', deleteTeacher);

router.get('/teachers/:id/classrooms/:classroomId/students', getStudentsInClassroom);
router.get('/teachers/:id/classrooms/:classroomId/students/:studentId', getStudentProfileForTeacher);
router.put(
    '/teachers/:teacherId/classrooms/:classroomId/updateSeatingChart',
    // verifyToken,
    // verifyUser,
    updateStudentSeats
  );
router.put("/teachers/:id/classrooms/:classroomId/students/:studentId", verifyToken, verifyUser, editStudentInformation);

// router.get('/teachers/:id/students', getAllStudentsForTeacher);
router.get('/teachers/:id/classrooms/:classroomId', getClassBySubject);

// ================================================== //
//check
router.delete('/teachers/:id/classrooms/:classroomId/students/:studentId', verifyToken, verifyUser, deleteStudentInClassroom);
router.post('/teachers/:id/classrooms/:classroomId/students', addStudentToClassroom);

//check
router.delete('/teachers/:id/classrooms/:classroomId', verifyToken, verifyUser, deleteClassroom);
router.post('/teachers/:id/classrooms', createClassroom);

router.put('/teachers/:id/classrooms', createClassroom);

module.exports = router;
