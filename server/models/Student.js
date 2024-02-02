const mongoose = require("mongoose");


const StudentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    seatNumber: { type: Number },
    birthday: { type: String },
    gradeYear: { type: String },
    schoolStudentId: { type: String },
    avatarImg: {
        type: String
    },
    iepStatus: { type: String },

    journalEntries: [{
        date: { type: String },
        checkin: {
            emotion: { type: String },
            // ZOR = Zone of Regulation
            ZOR: { type: String },
            goal: { type: String },
            need: { type: String },
            present: { type: Boolean },
        },
        checkout: {
            emotion: { type: String },
            // ZOR = Zone of Regulation
            ZOR: { type: String },
            goal: { type: String },
            need: { type: String },
            highlight: { type: String },
        }
    }],
    contentAreaNotices: [{
        contentArea: { type: String },
        benchmark: { type: String },
    }],
    learningChallenges: [{
        challenge: { type: String },
        date: {
            type: Date,
            get: date => date.toISOString().slice(0, 10),
            set: dateString => new Date(dateString)
        }
    }],
    accomodationsAndAssisstiveTech: [{
        accomodation: { type: String },
        location: { type: String },
        frequency: { type: String },

    }]
})

module.exports = mongoose.model('Student', StudentSchema);
