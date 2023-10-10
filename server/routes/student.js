const { createNewStudent, getAllStudents, getStudentById, updateStudentJournalEntry, deleteStudent } = require('../controllers/studentController')
const router = require("express").Router();

// (I think signup is being used instead of this)
router.post('/students', createNewStudent);

// not for specific teacher/classroom
router.get('/students', getAllStudents)
router.get("/students/:id", getStudentById);
router.put("/students/:id", updateStudentJournalEntry);
router.delete("/students/:id", deleteStudent);

module.exports = router;