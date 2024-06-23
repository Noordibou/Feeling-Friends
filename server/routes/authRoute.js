const { Signup, Login, findUser, findUserById, Logout } = require('../controllers/authControllers')
const { userVerification } = require('../middleware/authMiddleware')
const { signUpValidation, verifyUser } = require("../middleware/index")
const router = require("express").Router();
const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");


// const studentAccessToTeacherHome = (req, res, next) => {
//     if (req.user.role === 'student' && req.path === '/teacher-home') {
//         return res.status(403).json({ message: 'Access denied', success: false });
//     }
//     next();
// };

// router.use(studentAccessToTeacherHome);

// router.get("/teacher-home", userVerification , (req, res) => {
//     // You can now access req.user.role
//     if (req.user.role === "student") {
//       return res
//         .status(403)
//         .json({ message: "Access denied", success: false });
//     }});


router.post("/signup", signUpValidation, Signup);
router.post("/login", Login);
router.post('/', userVerification);
router.get('/logout', Logout)
router.get("/users", findUser);
router.get('/users/:id', findUserById)
router.get('/check-auth', (req, res) => {

    const token = req.cookies.token;
    console.log("boop the check auth is getting hit")
    if (!token) {
        return res.json({ status: false });
    }
    console.log("heloo")
    jwt.verify(token, process.env.TOKEN_KEY, async (err, decodedToken) => {
        console.log("verifying...")
        if (err) {
        console.error('Token verification failed:', err);
        return res.json({ status: false });
        } else {
            console.log("try")
        try {
            const user = await User.findById(decodedToken.id);
    
            if (user) {
            return res.json({ status: true, user: user.username, role: user.role });
            } else {
            return res.json({ status: false });
            }
        } catch (error) {
            console.error('Error finding user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        }
    });

})

module.exports = router;
