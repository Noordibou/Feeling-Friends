const Teacher = require('../models/Teacher.js');
const Student = require("../models/Student.js")
const User = require('../models/User.js');

// Create a new teacher, but signup in authentication should be doing that I think
const createNewTeacher = async (req, res) => {
    try {
        // Create a new user first
        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            role: 'teacher',
        });

        // Save the user
        await user.save();

        // Create a new teacher and associate it with the user
        const teacher = new Teacher({
            user: user._id,
            prefix: req.body.prefix,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            schoolTeacherId: req.body.schoolTeacherId,
            role: 'teacher',
            avatarImg: req.body.avatarImg,
            classrooms: req.body.classrooms,
        });

        // Save the teacher
        await teacher.save();

        // Return the newly created teacher object in the response
        res.json(teacher);
    } catch (error) {
        res.status(400).json(error);
    }
}

const getAllTeachers = async (req, res) => {
    const teacher = await Teacher.find();
    res.json(teacher);
}

const getTeacherById = async (req, res) => {
    const teacherId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return res.status(400).json({ message: 'Invalid teacher ID format.' });
    }

    try {
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }

        res.json(teacher);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateTeacherInfo = async (req, res) => {
    try {
        res.json(
            await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
    } catch (error) {
        res.status(400).json(error);
    }
}

const deleteTeacher = async (req, res) => {
    try {
        res.json(await Teacher.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
}

const getClassBySubject = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const classroom = teacher.classrooms.id(req.params.classroomId);

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        res.json(classroom);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

const getStudentsInClassroom = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        const classroom = teacher.classrooms.id(req.params.classroomId);

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        const studentIds = classroom.students;

        const students = await Student.find({ _id: { $in: studentIds } });

        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}


const getStudentProfileForTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        const classroom = teacher.classrooms.id(req.params.classroomId);

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        const studentId = req.params.studentId; 

        if (!classroom.students.includes(studentId)) {
            return res.status(404).json({ error: 'Student not found in the classroom' });
        }

       
        const studentData = await Student.findById(studentId);

        res.json(studentData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

const editStudentInformation = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        const classroom = teacher.classrooms.id(req.params.classroomId);

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        const studentId = req.params.studentId;
        const updatedData = req.body;

        const studentIndex = classroom.students.findIndex(studentRef => studentRef.equals(studentId));

        if (studentIndex === -1) {
            return res.status(404).json({ error: 'Student not found in the classroom' });
        }

        
        const studentToUpdateId = classroom.students[studentIndex];

        const studentToUpdate = await Student.findById(studentToUpdateId);

        if (!studentToUpdate) {
            return res.status(404).json({ error: 'Student not found' });
        }

    
        for (const key in updatedData) {
            studentToUpdate[key] = updatedData[key];
        }

        const updatedStudent = await studentToUpdate.save();

        res.json(updatedStudent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

// currently not using, but it works
const getAllStudentsForTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id).populate('classrooms.students');
        
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const students = teacher.classrooms.reduce((allStudents, classroom) => {
            allStudents.push(...classroom.students);
            return allStudents;
        }, []);

        return res.status(200).json(students);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching students for the teacher: ' + error.message });
    }
}

const deleteStudentInClassroom = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        const classroom = teacher.classrooms.id(req.params.classroomId);

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        const studentId = req.params.studentId;

        // Check if the student is in the classroom
        const studentIndex = classroom.students.findIndex(studentRef => studentRef.equals(studentId));

        if (studentIndex === -1) {
            return res.status(404).json({ error: 'Student not found in the classroom' });
        }

        // Remove the student from the classroom's students array
        classroom.students.splice(studentIndex, 1);
        await teacher.save();

        res.json({ message: 'Student removed from the classroom' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const addStudentToClassroom = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        const classroom = teacher.classrooms.id(req.params.classroomId);

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        const studentId = req.body.studentId;

        // Check if the student is already in the classroom
        if (classroom.students.includes(studentId)) {
            return res.status(400).json({ error: 'Student is already in the classroom' });
        }

        // Add the student to the classroom's students array
        classroom.students.push(studentId);
        await teacher.save();

        // Get the updated list of students in the classroom
        const updatedStudents = await Student.find({ _id: { $in: classroom.students } });

        res.json({ message: 'Student added to the classroom', students: updatedStudents });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
 

const deleteClassroom = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const classroomId = req.params.classroomId;

        // Find the classroom by its ID and remove it from the teacher's classrooms array
        teacher.classrooms.id(classroomId).remove();

        await teacher.save();

        res.json({ message: 'Classroom deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createClassroom = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const newClassroom = {
            classSubject: req.body.classSubject,
            location: req.body.location,
            students: [],
        };

        teacher.classrooms.push(newClassroom);
        await teacher.save();

        res.json(newClassroom);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {
    createNewTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacherInfo,
    deleteTeacher,
    getClassBySubject,
    getStudentsInClassroom,
    getStudentProfileForTeacher,
    getAllStudentsForTeacher,
    editStudentInformation,
    deleteStudentInClassroom,
    addStudentToClassroom,
    deleteClassroom,
    createClassroom,

};


// =================================================== //

// // FIXME: *** WILL NEED TO CHANGE *** //

// // FIXME: *** WILL NEED TO CHANGE *** //
// // Adds a student to the teacher's classroom roster
// const addStudentToClass = async (req, res) => {
//     const teacher = await Teacher.findById(req.params.teacher_id);
//     const student = await Student.findById(req.params.student_id);

//     teacher.students.push(student._id);
//     await teacher.save();
//     res.json(teacher);

// }

// // FIXME: *** WILL NEED TO CHANGE *** //
// // Deletes a student in a teacher's classroom
// const removeStudentFromClass = async (req, res) => {
//     const teacher = await Teacher.findById(req.params.teacher_id);
//     const student = await Student.findById(req.params.student_id);

//     teacher.students = teacher.students.filter((student) => student.id !== student.id);
//     await teacher.save();
//     res.sendStatus(200);
// }

// module.exports = {
//     createNewTeacher,
//     getAllTeachers,
//     getTeacherById,
//     updateTeacherInfo,
//     deleteTeacher,
//     getClassBySubject,
//     getAllStudentsInClassroom,
//     addStudentToClass,
//     removeStudentFromClass,
//     getStudentsInClassroom,
//     getStudentProfileForTeacher
// }