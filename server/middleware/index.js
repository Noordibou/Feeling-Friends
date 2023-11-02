const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const User = require("../models/User")


// TODO: Middleware  functions:
// // * checkRole: checks that the user making the request has the right role
// // * validation: makes sure that info being passed to database is correct

// authentication: verifies the request is coming from the user
const verifyToken = (req, res, next) => {
  console.log("Verify Token being called")
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// authorization: verifies user's id
const verifyUser = (req, res, next) => {
  console.log("Verify User being called")
    const userId = req.user.roleId;
    const studentId = req.params.id;


    if (userId !== studentId) {
        return res.status(403).json({ message: 'You are not authorized to access this data, user does not match' })
    }
    next();
}

// FIXME: currently doesnt work when changing to the url teacher-home, but it should since it should be only getting teacher information
const verifyRole = (allowedRoles) => (req, res, next) => {
  const userRole = req.user.role
  
  if (allowedRoles.includes(userRole)) {
    next();
  } else {
    res.status(403).json({message: "You are not authorized to access this information, role doesn't match"})
  }
}

const setCacheControlHeader = (req, res, next) => {
  // Set cache control headers to allow client-side caching for a reasonable duration
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Example: Cache for 1 hour
  next();
}

const signUpValidation = async (req, res, next) => {
  const { email, password, username, role, student, teacher } = req.body;
  const errors = [];

  if (!email || !isEmailValid(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  //---------------- Error ------------------//
  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.push({ field: 'email', message: 'Email is already in use' });
    }
  } else {
    // Handle the case when email is not provided (e.g., return an error message)
    errors.push({ field: 'email', message: 'Email is required' });
  }
//----------------------------------//
 
  if (!password || password.length < 4) {
    errors.push({ field: 'password', message: 'Password must be at least 4 characters' });
  }

  if (!username || username.length < 5) {
    errors.push({ field: 'username', message: 'Username must be at least 2 characters' });
  }
//---------------- Error ------------------//
  if (username) {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      errors.push({ field: 'username', message: 'Username is already in use' });
    }
  }
//----------------------------------//
  // Check role
  if (!role || !['student', 'teacher'].includes(role)) {
    errors.push({ field: 'role', message: 'Invalid role' });
  }

  if (student && teacher) {
    errors.push('Either student or teacher ID should be specified, not both.');
  }

  // Check if teacher/student ID is a valid ObjectId
  if ((student && !mongoose.Types.ObjectId.isValid(student)) && (teacher && !mongoose.Types.ObjectId.isValid(teacher))) {
    errors.push(`${role} should be a valid ObjectId.`);
  }


  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

const isEmailValid = (email) => {
  // Add your email validation logic here
  // For a basic example, you can use a regular expression
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

// const validateTeacherId = async (req, res, next) => {
//   const teacherId = req.params.id;

//   if (!mongoose.Types.ObjectId.isValid(teacherId)) {
//     return res.status(400).json({ message: 'Invalid teacher ID format.' });
//   }

//   try {
//     const teacher = await Teacher.findById(teacherId);
//     if (!teacher) {
//       return res.status(404).json({ message: 'Teacher not found.' });
//     }

//     // If the teacher exists, you can optionally attach the teacher object to the request for use in your route handler
//     req.teacher = teacher;

//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }



// TODO:
// only the student who is the owner of the data can access it. If you have different authorization levels (e.g., admin, teacher, etc.), you might need to extend your authorization logic accordingly.

// FIXME: not configured yet
// // can make special permissions file, or an Access Control List (ACL)
// // Example:
// const acl = {
//   students: {
//     admin: ['read', 'create', 'update', 'delete'],
//     teacher: ['read', 'update'],
//     student: ['read'],
//   },
//   courses: {
//     admin: ['read', 'create', 'update', 'delete'],
//     teacher: ['read', 'update'],
//     student: ['read'],
//   },
//   grades: {
//     admin: ['read', 'create', 'update', 'delete'],
//     teacher: ['read', 'update'],
//     student: ['read'],
//   },
// };

// FIXME: not tested yet
// const checkPermission = (resourceType, action) => (req, res, next) => {
//   const userRole = req.user.role; // Get the user's role from the token

//   // Check if the user's role is allowed to perform the specified action on the resource type
//   if (acl[resourceType] && acl[resourceType][userRole] && acl[resourceType][userRole].includes(action)) {
//     next(); // User is authorized
//   } else {
//     res.status(403).json({ message: 'You are not authorized to perform this action on this resource.' });
//   }
// };


module.exports = {
    verifyToken,
    verifyUser,
    verifyRole,
    setCacheControlHeader,
    signUpValidation,
  
}