const mongoose = require("mongoose");
const User = require('./User.js');

const StudentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: true },
    avatarImg: { type: String },
    journalEntries: [{
        date: { type: String },
        checkin: {
            emotion: { type: String },
            // ZOR = Zone of Regulation
            ZOR: { type: String },
            goal: { type: String },
            need: { type: String },
            present: { type: boolean },
        },
        checkout: {
            emotion: { type: String },
            // ZOR = Zone of Regulation
            ZOR: { type: String },
            goal: { type: String },
            need: { type: String },
            highlight: { type: String },
        }
    }]

})

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;