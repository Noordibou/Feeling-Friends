const cron = require('cron')
const { generateRandAnswers } = require('./generateRandAnswers')


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
// TODO: need to loop through all the students, update their JE array with new randomly generated answers.
const task = cron.job('0 7 * * 1,4', () => {
    const randomAnswers = generateRandAnswers();



})