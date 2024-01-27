const Teacher = require("../models/Teacher.js");
const Student = require("../models/Student.js");
const User = require("../models/User.js");
const mongoose = require("mongoose");


const createNewTeacher = async (req, res) => {
  try {
    // Create a new user first
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      role: "teacher",
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
      role: "teacher",
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
};

// DELETE AFTER FINISHED. DEBUG ONLY
const getAllTeachers = async (req, res) => {
  const teacher = await Teacher.find();
  res.json(teacher);
};

const getTeacherById = async (req, res) => {
  const teacherId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    return res.status(400).json({ message: "Invalid teacher ID format." });
  }

  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    res.json(teacher);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Couldnt get Teacher by id: Internal server error" });
  }
};

const updateTeacherInfo = async (req, res) => {
  try {
    res.json(
      await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteTeacher = async (req, res) => {
  try {
    res.json(await Teacher.findByIdAndRemove(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
};

const getClassBySubject = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const classroom = teacher.classrooms.id(req.params.classroomId);

    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    res.json(classroom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getStudentsInClassroom = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const classroom = teacher.classrooms.id(req.params.classroomId);

    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    const studentIds = classroom.students.map(studentInfo => studentInfo.student);

    const students = await Student.find({ _id: { $in: studentIds } });

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


const getStudentProfileForTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const classroom = teacher.classrooms.id(req.params.classroomId);

    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    const studentId = req.params.studentId;

    const studentInClassroom = classroom.students.find(
      (studentObj) =>
        studentObj && studentObj.student && studentObj.student.equals(studentId)
    );

    if (!studentInClassroom) {
      return res
        .status(404)
        .json({ error: "Student not found in the classroom" });
    }

    const studentData = await Student.findById(studentId);

    if (!studentData) {
      return res.status(404).json({ error: "Student data not found" });
    }

    res.json(studentData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


const editStudentInformation = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const classroom = teacher.classrooms.id(req.params.classroomId);

    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    const studentId = req.params.studentId;
    const updatedData = req.body;

    const studentIndex = classroom.students.findIndex(
      (studentRef) => studentRef.student.equals(studentId)
    );

    if (studentIndex === -1) {
      return res
        .status(404)
        .json({ error: "Student not found in the classroom" });
    }

    const studentToUpdate = classroom.students[studentIndex].student;

    const updatedStudent = await Student.findByIdAndUpdate(
      studentToUpdate,
      updatedData,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


const getAllStudentsForTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate(
      "classrooms.students"
    );

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const students = teacher.classrooms.reduce((allStudents, classroom) => {
      allStudents.push(...classroom.students);
      return allStudents;
    }, []);

    return res.status(200).json(students);
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error fetching students for the teacher: " + error.message,
      });
  }
};

const deleteStudentInClassroom = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const classroom = teacher.classrooms.id(req.params.classroomId);

    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    const studentId = req.params.studentId;

    const studentIndex = classroom.students.findIndex(
      (studentRef) => studentRef.student.equals(studentId)
    );

    if (studentIndex === -1) {
      return res
        .status(404)
        .json({ error: "Student not found in the classroom" });
    }

    classroom.students.splice(studentIndex, 1);
    await teacher.save();

    res.json({ message: "Student removed from the classroom" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


const addStudentToClassroom = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    const classroom = teacher.classrooms.id(req.params.classroomId);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    const studentId = req.body.studentId;

    if (classroom.students.includes(studentId)) {
      return res
        .status(400)
        .json({ error: "Student is already in the classroom" });
    }

    console.log("studentID: " + studentId)

    classroom.students.push({ student: studentId });
    await teacher.save();

    const updatedStudents = await Student.find({
      _id: { $in: classroom.students.map(studentObj => studentObj.student) },
    });

    console.log("updated students: " + updatedStudents)

    res.json({
      message: "Student added to the classroom",
      students: updatedStudents,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteClassroom = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const classroomId = req.params.classroomId;

    const classroomIndex = teacher.classrooms.findIndex(
      (c) => c._id.toString() === classroomId
    );

    if (classroomIndex === -1) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    teacher.classrooms.splice(classroomIndex, 1);

    await teacher.save();

    res.json({ message: "Classroom deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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
      students: req.body.students || [],
    };

    teacher.classrooms.push(newClassroom);
    await teacher.save();
    res.json(newClassroom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// updating the student seating chart with x y coords and assigned or unassigned.
const updateStudentSeats = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const classroomId = req.params.classroomId;
    const updatedSeats = req.body;

    // Find the teacher by ID
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Find the classroom within the teacher's classrooms
    const classroom = teacher.classrooms.id(classroomId);

    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    // Update the X and Y coordinates and "assigned" for each student in the classroom
    updatedSeats.positions.forEach((updatedPosition) => {
      const studentId = updatedPosition.student;
      const student = classroom.students.find(student => student.student.equals(studentId));
      if (student) {
        student.seatInfo.x = updatedPosition.seatInfo.x;
        student.seatInfo.y = updatedPosition.seatInfo.y;
        student.seatInfo.assigned = updatedPosition.seatInfo.assigned;
      }
    });

    // Save the changes to the teacher's data
    await teacher.save();

    res.json({ message: "Student positions updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const addFurniture = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const classroomId = req.params.classroomId;
    const furnitureArray = req.body;
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const classroom = teacher.classrooms.id(classroomId);

    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }
    classroom.furniture.push(...furnitureArray);
    await teacher.save();

    res.json({ message: "Furniture added successfully", classroom });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Couldn't add furniture, Server error" });
  }
}

const updateFurniturePositions = async (req, res) => {
  console.log("Oh heyy it hit the backend update furniture positions hmm")
  try {
    const teacherId = req.params.id;
    const classroomId = req.params.classroomId;
    const updatedPositions = req.body;

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const classroom = teacher.classrooms.id(classroomId);

    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    // Update each furniture item in the classroom
    updatedPositions.forEach((updatedPosition) => {
      const furnitureItem = classroom.furniture.id(updatedPosition.itemId);

      if (furnitureItem) {
        furnitureItem.x = updatedPosition.x;
        furnitureItem.y = updatedPosition.y;
        furnitureItem.assigned = updatedPosition.assigned;
        furnitureItem.rotation = (updatedPosition.rotation % 360 === 0 ? 0 : updatedPosition.rotation % 360)
      }
    });

    await teacher.save();

    res.json({ message: "Furniture positions updated successfully", classroom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Couldn't update furniture positions, Server error" });
  }
};

const deleteFurniture = async (req, res) => {
  console.log("oh hi")
  try {
    const teacherId = req.params.id;
    const classroomId = req.params.classroomId;
    const itemIdsToDelete = req.body;
    console.log("what is this: " + JSON.stringify(itemIdsToDelete))
    console.log("req.body: " + JSON.stringify(req.body))
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const classroom = teacher.classrooms.id(classroomId);

    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }
    console.log("okay here")
    // Find the furniture item to delete
    itemIdsToDelete.forEach(itemId => {
      // Find the furniture item to delete
      const furnitureIndexToDelete = classroom.furniture.findIndex(item => item._id == itemId);

      if (furnitureIndexToDelete !== -1) {
        // Remove the furniture item from the array
        classroom.furniture.splice(furnitureIndexToDelete, 1);
      } else {
        return res.status(404).json({ error: "Furniture item not found" });
      }
    });

    await teacher.save();

    res.json({ message: "Furniture deleted successfully", classroom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Couldn't delete furniture, Server error" });
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
  updateStudentSeats,
  getAllStudents,
  addFurniture,
  updateFurniturePositions,
  deleteFurniture,
};
