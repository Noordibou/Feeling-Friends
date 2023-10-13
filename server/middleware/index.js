const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");

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

// TODO: Middleware  functions:
// // * checkRole: checks that the user making the request has the right role
// // * validation: makes sure that info being passed to database is correct

// authorization: verifies user's id
const verifyUser = (req, res, next) => {
  console.log("Verify User being called")
    const userId = req.user.roleId;
    const studentId = req.params.id;

    if (userId !== studentId) {
        return res.status(403).json({ message: 'You are not authorized to access this data' })
    }
    next();
}

// NOTES:
// only the student who is the owner of the data can access it. If you have different authorization levels (e.g., admin, teacher, etc.), you might need to extend your authorization logic accordingly.


// move to index.js? used if an api call is made that doesn't exist
// app.all("*", (req, res) => {
//     res.status(404);
//     throw new Error("Route not found")

//     or
// res.status(404).sendFile(path.join(__dirname, "public/404.html")); // Serve a 404 page

// })

module.exports = {
    verifyToken,
    verifyUser
}