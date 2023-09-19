const Student = require("../models/Student");
const User = require("../models/User");
const { createSecretToken } = require("../util/secretToken");
const bcrypt = require("bcryptjs");


//creates user and student at same time
const Signup = async (req, res, next) => {
  try {
    const { email, password, username, role, studentDetails } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    // const objectId = mongoose.Types.ObjectId(studentObjectId);
    // const foundStudent = await Student.findOne({ _id: objectId });

    if (!existingStudent) {
      // Create a new student if none exists with the provided schoolStudentId
      existingStudent = await Student.create(studentDetails);
    }

    // Create a new user and associate it with the existing (or newly created) student
    const user = await User.create({ email, password, username, role, student: existingStudent._id });
    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res.status(201).json({ message: "User signed in successfully", success: true, user });
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
    const token = createSecretToken(user._id);

    let redirectPath = '/';
    let studentId = null; // Initialize the studentId variable

    if(user.role === 'student') {
      redirectPath = '/student-home';
      // If the user is a student, you can access their associated student's ObjectID
      if (user.student) {
        studentId = user.student.toString(); // Convert the ObjectId to a string
      }
    } else if(user.role === 'teacher') {
      redirectPath = '/teacher-home';  
    } else {
        return res.status(403).json({ message: 'Access denied for this role', success: false });
      }
    
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res.status(200).json({ message: "User logged in successfully", success: true, redirectPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  Signup,
  Login,
  findUser
};
