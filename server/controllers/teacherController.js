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
            avatarImg: req.body.avatarImg,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            classrooms: req.body.classrooms, // Include classrooms from req.body
           
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
    try {
        res.json(await Teacher.findById(req.params.id));
    } catch (error) {
        res.status(400).json(error);
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

// =================================================== //

// FIXME: *** WILL NEED TO CHANGE *** //
// Gets all students within a teacher's classroom
const getAllStudentsInClassroom = async (req, res) => {
    const teacher = await Teacher.findById(req.params.teacher_id);
    const students = await Student.find({ _id: { $in: teacher.students }});
    res.json(students)
}

// FIXME: *** WILL NEED TO CHANGE *** //
// Adds a student to the teacher's classroom roster
const addStudentToClass = async (req, res) => {
    const teacher = await Teacher.findById(req.params.teacher_id);
    const student = await Student.findById(req.params.student_id);
  
    teacher.students.push(student._id);
    await teacher.save();
    res.json(teacher);
    
}

// FIXME: *** WILL NEED TO CHANGE *** //
// Deletes a student in a teacher's classroom
const removeStudentFromClass = async (req, res) => {
    const teacher = await Teacher.findById(req.params.teacher_id);
    const student = await Student.findById(req.params.student_id);

    teacher.students = teacher.students.filter((student) => student.id !== student.id);
    await teacher.save();
    res.sendStatus(200);
}

module.exports = {
    createNewTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacherInfo,
    deleteTeacher,
    getAllStudentsInClassroom,
    addStudentToClass,
    removeStudentFromClass
}