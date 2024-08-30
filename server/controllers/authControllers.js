const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const User = require("../models/User");
const { createSecretToken } = require("../util/secretToken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

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

    // Update the corresponding model with the user._id
    if (role === "student" && existingStudent) {
      existingStudent.user = user._id;
      await existingStudent.save();
    } else if (role === "teacher" && existingTeacher) {
      existingTeacher.user = user._id;
      await existingTeacher.save();
    }

    const newIdByRole = ( role === "student" ? user.student : user.teacher)

    const token = createSecretToken(user._id, newIdByRole, user.role);

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

    let responseData = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    
    res.status(200).json({ responseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const findUserByTeacherId = async (req, res) => {
  console.log("hello check check")
  try {
    // Extract teacherId from the request parameters
    const teacherId = req.params.teacherId;

    // Find a user where the teacher field matches the teacherId
    const user = await User.findOne({ teacher: teacherId });

    console.log("user: " + JSON.stringify(user))

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare the response data
    let responseData = {
      email: user.email,
      username: user.username
    };

    console.log("response data from backend contorllelr: " + JSON.stringify(responseData))

    res.status(200).json({ responseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


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

const checkAuth = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, decodedToken) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.json({ status: false });
    } else {
      console.log("try");
      try {
        const user = await User.findById(decodedToken.id);

        if (user) {
          return res.json({
            status: true,
            user: user.username,
            role: user.role,
          });
        } else {
          return res.json({ status: false });
        }
      } catch (error) {
        console.error("Error finding user:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  });
};


const updateTeacherAcctInfo = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const { email, username } = req.body;

    // Find the user by their teacher ID
    const user = await User.findOne({ teacher: teacherId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the email and username fields
    user.email = email || user.email;
    user.username = username || user.username;

    // Save the updated user information
    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      success: true,
      user,
    });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updatePassword = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    const user = await User.findOne({ teacher: teacherId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Check if new password and confirmation match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // Ensure new password is different from current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password cannot be the same as the current password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  Signup,
  Login,
  Logout,
  findUser,
  findUserById,
  checkAuth,
  updateTeacherAcctInfo,
  findUserByTeacherId,
  updatePassword
};
