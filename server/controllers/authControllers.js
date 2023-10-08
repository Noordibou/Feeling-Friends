const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const User = require("../models/User");
const { createSecretToken } = require("../util/secretToken");
const bcrypt = require("bcryptjs");

const Signup = async (req, res, next) => {
  console.log(req.body);
  try {
    const { email, password, username, role, studentDetails, teacherDetails } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    let existingStudent = null;
    let existingTeacher = null;

    if (role === 'student') {
      existingStudent = await Student.findOne({ schoolStudentId: studentDetails.schoolStudentId });
      if (!existingStudent) {
       
        existingStudent = await Student.create(studentDetails);
      }
    } else if (role === 'teacher') {
      existingTeacher = await Teacher.findOne({ schoolTeacherId: teacherDetails.schoolTeacherId });
      if (!existingTeacher) {
        
        existingTeacher = await Teacher.create(teacherDetails);
      }
    }

    
    const user = await User.create({ email, password, username, role });

    if (role === 'student') {
      user.student = existingStudent._id;
    } else if (role === 'teacher') {
      user.teacher = existingTeacher._id;
    }

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res.status(201).json({ message: "User signed up successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const findUser = async (req, res) => {
  const user = await User.find();
  res.json(user)
}

const findUserById = async (req, res) => {
  try {
    const userId = req.params.id; 

    const user = await User.findById(userId);

    if (!user) {
      
      return res.status(404).json({ message: 'User not found' });
    }

    
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


// const Signup = async (req, res, next) => {
//   try {
//     const { email, password, username, role } = req.body;
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.json({ message: "User already exists" });
//     }

//     const user = await User.create({ email, password, username, role });
//     const token = createSecretToken(user._id);
//     res.cookie("token", token, {
//       withCredentials: true,
//       httpOnly: false,
//     });
//     res
//       .status(201)
//       .json({ message: "User signed in successfully", success: true, user });
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'Incorrect password or email' });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: 'Incorrect password or email' });
    }

    // TODO: need to save studentID or teacherID to this token
    // Student: user id, student id
    // Teacher: user id, teacher id
    // const token = createSecretToken(user._id);
    let token = null;

    let redirectPath = '/';

    if(user.role === 'student') {
      // const studentId = user.student
      token = createSecretToken(user._id);

      redirectPath = '/student-home';
    } else if(user.role === 'teacher') {
      // const teacherId = user.teacher
      token = createSecretToken(user._id);

      redirectPath = '/teacher-home';  
    } else {
        return res.status(403).json({ message: 'Access denied for this role', success: false });
      }
    

    const responseObject = {
      message: "User logged in successfully",
      success: true,
      user: {
        _id: user._id, // Include the user's _id (objectID)
        email: user.email,
        username: user.username,
        role: user.role,
        student: user.student,
        // Add any other user properties you want to include
      },
      redirectPath,
    };


    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res.status(200).json({ message: "User logged in successfully", success: true,  user: {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      student: user.student,
      // Add any other user properties you want to include
    }, redirectPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  Signup,
  Login,
  findUser,
  findUserById,
  
};
