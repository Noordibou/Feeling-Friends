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