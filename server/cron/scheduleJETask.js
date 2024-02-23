const { CronJob } = require('cron');
const { generateRandAnswers } = require('./generateRandAnswers');
const Student = require('../models/Student');
const mongoose = require('mongoose');
const { updateStudentJournalEntry } = require('../controllers/studentController');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

console.log("it's running the file!")

const job = new CronJob(
    '0 5 * * 1,5', // cronTime
    async function() {
        try {
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
        } catch (error) {
            console.log("it's erroring")
            console.error('Error adding random journal entries: ', error);
        }
    },
    null, // onComplete, might change that to a console log..?
    true, // start
    'America/Los_Angeles' // timeZone
);

job.start();