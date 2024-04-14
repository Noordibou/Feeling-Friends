const { generateRandAnswers } = require('./generateRandAnswers');
const Student = require('../models/Student');
const mongoose = require('mongoose');
const { updateStudentJournalEntry } = require('../controllers/studentController');
require('dotenv').config();

console.log("it's running the file!")

const autoJournalEntries = async () => {
    try {
        mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const students = await Student.find();
        for (const student of students) {
            const shouldGenerateRandomAnswers = Math.random() < 0.7;
            if (shouldGenerateRandomAnswers) {
                const randomAnswers = generateRandAnswers();
                const req = {
                    params: { id: student._id },
                    body: {
                        studentUpdate: randomAnswers,
                        checkInOutType: Math.random() < 0.5 ? 'checkout' : 'checkin'
                    }
                };
                const res = {
                    json: data => console.log(JSON.stringify(data)),
                    status: code => ({ json: error => console.error(error) })
                };
                await updateStudentJournalEntry(req, res);
            }
            // Delete oldest journal entry if entries exceed 30
            if (student.journalEntries.length > 30) {
                student.journalEntries.shift(); // Remove the oldest entry
                await student.save(); // Save changes to the student document
                console.log('Oldest journal entry deleted for student:', student._id);
            }
        }
        console.log('Random journal entries added successfully to all students');
        process.exit(0)
    } catch (error) {
        console.log("it's erroring")
        console.error('Error adding random journal entries: ', error);
        process.exit(1)
    }
}

// executes for cron job
autoJournalEntries();