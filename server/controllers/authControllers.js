const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const User = require("../models/User");
const { createSecretToken } = require("../util/secretToken");
const bcrypt = require("bcryptjs");

const Signup = async (req, res, next) => {
  console.log(req.body);
  try {
    const { email, password, username, role, userDetails } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    existingStudent = null
    existingTeacher = null

    if (role === "student") {
      existingStudent = await Student.create(userDetails);
    } else if (role === "teacher") {
      existingTeacher = await Teacher.create(userDetails);
    }

    const userData = {
      email,
      password,
      username,
      role,
      student: existingStudent ? existingStudent._id : null,
      teacher: existingTeacher ? existingTeacher._id : null,
    };

    const user = await User.create(userData);

    const token = createSecretToken(user._id, user.student, user.role);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res
      .status(201)
      .json({ message: "User signed up successfully", success: true, user });


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

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'Incorrect password or email' });
    }

    if (!user.teacher && !user.student) {
      console.error({ message: `Error, no ${user.role} id found`})
      return res.json({ message: `Error: ${user.role} id required for login. No ${user.role} id found` });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: 'Incorrect password or email' });
    }

    let token = null;

    let redirectPath = null;


    // TODO: *might be able to prevent user from going to different urls based on role

    if(user.role === 'student') {

      token = createSecretToken(user._id, user.student, user.role);

      redirectPath = '/student-home';
    } else if(user.role === 'teacher') {
      token = createSecretToken(user._id, user.teacher, user.role);

      redirectPath = '/teacher-home';  
    } else {
        return res.status(403).json({ message: 'Access denied for this role', success: false });
      }
    
    res.cookie("token", token, {
      secure: true,
      httpOnly: true,
      path: '/',
      sameSite: "none",
    });

    if (user) {
      let responseData = {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      };
  
      if (user.role === 'student') {
        responseData.student = user.student;
      } if (user.role === 'teacher') {
        responseData.teacher = user.teacher;
      }
  
      res.status(200).json({
        message: "User logged in successfully",
        success: true,
        user: responseData,
        redirectPath
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const Logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).send({ message: 'Logged out successfully' });
  } catch (error) {
    console.error("Error clearing cookie:", error);
    res.status(500).send({ message: 'Error clearing cookie' });
  }
  
}

module.exports = {
  Signup,
  Login,
  Logout,
  findUser,
  findUserById, 
};
