const cron = require('cron')
const { generateRandAnswers } = require('./generateRandAnswers')

// TODO: need to loop through all the students, update their JE array with new randomly generated answers.
const task = cron.job('0 7 * * *', () => {
    const randomAnswers = generateRandAnswers();

})