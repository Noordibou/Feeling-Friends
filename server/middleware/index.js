const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token
  console.log("what is this token in veryfiToken? " + token)

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    console.log("well hey")
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    console.log("decoded: " + JSON.stringify(decoded))
    req.user = decoded;
    console.log('hey you here?')
    next();
  } catch (error) {
    console.log("The error is: ", error)
    res.status(400).json({ message: 'Invalid token.' });
  }
};




// TODO: Middleware  functions:

// // * verifyUser: that checks the user's token (verifies the request is coming from the user)
// // * checkRole: checks that the user making the request has the right role
// // * validation: makes sure that info being passed to database is correct
// // * logger??? for error handling???

// FIXME: NOT YET TESTED
const verifyUser = (req, res, next) => {
    const userId = req.user.id;
    const studentId = req.params.id;
    console.log('userId: ', userId)
    console.log('studentId: ', studentId)

    if (userId !== studentId) {
        return res.status(403).json({ message: 'You are not authorized to access this student data' })
    }
    next();
}


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