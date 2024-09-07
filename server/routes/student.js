const { createNewStudent, getAllStudents, getStudentById, updateStudentJournalEntry, deleteStudent, createStudentAndUser } = require('../controllers/studentController')
const router = require("express").Router();
const {verifyToken, verifyUser, verifyRole, setCacheControlHeader}  = require('../middleware/index')

// (I think signup is being used instead of this)
router.post('/students', createNewStudent);
router.post('/create-student', createStudentAndUser)

// not for specific teacher/classroom
router.get('/students', setCacheControlHeader, getAllStudents)
router.get("/students/:id", setCacheControlHeader, verifyToken, verifyUser, verifyRole(["student"]), getStudentById);
router.put("/students/:id", verifyToken, verifyUser, updateStudentJournalEntry);
router.delete("/students/:id", deleteStudent);

module.exports = router;