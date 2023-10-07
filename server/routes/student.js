const { createNewStudent, getAllStudents, getStudentById, updateStudentJournalEntry, deleteStudent } = require('../controllers/studentController')
const router = require("express").Router();

// Create a new student
router.post('/students', createNewStudent);

// // Gets all students registered (not for specific teacher/classroom)
router.get('/students', getAllStudents)

// Gets specific student
router.get("/students/:id", getStudentById);

// Updates a specific student's journal entry
router.put("/students/:id", updateStudentJournalEntry);


// delete a student
router.delete("/students/:id", deleteStudent);


module.exports = router;