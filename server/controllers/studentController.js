const Student = require('../models/Student.js');
const User = require('../models/User.js');

// I don't think this works, use the Authentication Signup function
const createNewStudent = async (req, res) => {
    try {
        // Create a new user first
        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            role: 'student',
        });
  
        // Save the user
        await user.save();
  
        // Create a new student and associate it with the user
        const student = new Student({
            user: user._id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            seatNumber: req.body.seatNumber,
            birthday: req.body.birthday,
            gradeYear: req.body.gradeYear,
            schoolStudentId: req.body.schoolStudentId,
            role: 'student',
            avatarImg: req.body.avatarImg,
            journalEntries: req.body.journalEntries,
        });
  
        await student.save();
        res.json(student);
    } catch (error) {
        res.status(400).json(error);
    }
}

// Gets all students registered (not for specific teacher/classroom)
const getAllStudents = async (req, res) => {
    const students = await Student.find();
    res.json(students);
}

const getStudentById = async (req, res) => {
    try {
        res.json(await Student.findById(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
}

// Updates a specific student's journal entry
// if there is already a checkin or checkout, it will over write the previous entry
// TODO: ? make an alert or something that tells user they already have a checkin/out for this class today, and ask are they sure they want to overwrite it
const updateStudentJournalEntry = async (req, res) => {

  // ----- getting today's date ----- //
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const todayDate = `${month}-${day}-${year}`;
  // -------------------------------- // 

  try {
    const studentId = req.params.id;
    const { studentUpdate, checkInOutType} = req.body
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const todayDateExists = student.journalEntries.findIndex(
      (entry) => entry.date === todayDate
    );

    const commonProperties = {
      emotion: studentUpdate.emotion,
      ZOR: studentUpdate.ZOR,
      goal: studentUpdate.goal,
      need: studentUpdate.need,
    };
    
    // checking if there's already an entry
    if (todayDateExists !== -1) {
    
      if (checkInOutType === "checkout") {
        // if the student user chose "checkout", adds new object to be filled
        if (!student.journalEntries[todayDateExists].checkout) {
          student.journalEntries[todayDateExists].checkout = {};
        }
    
        // Update or add new checkout information
        student.journalEntries[todayDateExists].checkout = {
          ...student.journalEntries[todayDateExists].checkout,
          ...commonProperties,
          highlight: studentUpdate.highlight,
        };
      } else if (checkInOutType === "checkin") {
        // If student user chose "checkin", adds new object to be filled
        if (!student.journalEntries[todayDateExists].checkin) {
          student.journalEntries[todayDateExists].checkin = {};
        }
    
        // Update or add new checkin information
        student.journalEntries[todayDateExists].checkin = {
          ...student.journalEntries[todayDateExists].checkin,
          ...commonProperties,
          present: studentUpdate.present,
        };
      }
    } else {
      // No entry for the current date, so create a new one (this will always be done first thing in a new array)
      const journalEntry = {
        date: todayDate,
      };
    
      if (checkInOutType === "checkout") {
        journalEntry.checkout = {
          ...commonProperties,
          highlight: studentUpdate.highlight,
        };
      } else if (checkInOutType === "checkin") {
        journalEntry.checkin = {
          ...commonProperties,
          present: studentUpdate.present,
        };
      }
      // Add the new journal entry for the current date
      student.journalEntries.push(journalEntry);
    }

    // FIXME: No current way to catch if student enters the checkin/out more than two times. Find a way maybe on the home screen if they've already done all their checks for the day..?
    await student.save();

    res.json(student);
  } catch (error) {
    console.error("Error updating student journal entries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// delete a student
const deleteStudent = async (req, res) => {
    try {
        res.json(await Student.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
}

// Controller function to update a student's seat information
exports.updateStudentSeatInfo = async (req, res) => {
  try {
    // Retrieve the student by ID
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update the seat information
    student.seatInfo = req.body.seatInfo;

    // Save the changes
    await student.save();

    res.json({ message: 'Student seat information updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = {
    createNewStudent,
    getAllStudents,
    getStudentById,
    updateStudentJournalEntry,
    deleteStudent,
}