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

module.exports = {
    createNewTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacherInfo,
    deleteTeacher
}