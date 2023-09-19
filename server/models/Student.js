const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    seatNumber: { type: Number },
    birthday: { type: String },
    gradeYear: { type: String },
    schoolStudentId: { type: String },
    avatarImg: { type: String },
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
    }]

})

module.exports= mongoose.model('Student', StudentSchema);
