const { generateRandAnswers } = require('./generateRandAnswers');
const Student = require('../models/Student');
const mongoose = require('mongoose');
const { updateStudentJournalEntry } = require('../controllers/studentController');
require('dotenv').config();

console.log("it's running the file!")

const autoJournalEntries = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
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
                    json: () => {},
                    status: code => ({ json: error => console.error(error) })
                };
                await updateStudentJournalEntry(req, res);
            }

            // Log the current journal entries length
            console.log(`This student has ${student.journalEntries.length} journal entries`);

            // Delete oldest journal entries if entries exceed 30
            if (student.journalEntries.length > 30) {
                const excessEntries = student.journalEntries.length - 30;
                student.journalEntries.splice(0, excessEntries); // Remove the oldest entries
                console.log(`Removing ${excessEntries} oldest journal entries for a student`);
                
                // Try to save the document and catch versioning errors
                try {
                    await student.save(); // Save changes to the student document
                    console.log('Excess journal entries deleted a student');
                } catch (saveError) {
                    if (saveError instanceof mongoose.Error.VersionError) {
                        console.error('Version conflict for student:', student._id, 'Retrying...');
                        // Reload the document and retry
                        const freshStudent = await Student.findById(student._id);
                        freshStudent.journalEntries.splice(0, excessEntries);
                        await freshStudent.save();
                    } else {
                        throw saveError;
                    }
                }
            }
        }
        console.log('Random journal entries added successfully to all students');
        console.log('Job completed successfully.')
        process.exit(0);
    } catch (error) {
        console.log("it's erroring");
        console.error('Error adding random journal entries: ', error);
        process.exit(1);
    }
}

// Executes for cron job
autoJournalEntries();