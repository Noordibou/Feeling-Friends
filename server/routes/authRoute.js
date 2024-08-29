const { Signup, Login, findUser, findUserById, Logout, checkAuth, updateTeacherAcctInfo, findUserByTeacherId } = require('../controllers/authControllers')
const { userVerification } = require('../middleware/authMiddleware')
const { signUpValidation } = require("../middleware/index")
const router = require("express").Router();


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
router.get("/users/teacher/:teacherId", findUserByTeacherId)
router.get('/users/:id', findUserById)
router.get('/check-auth', checkAuth) // for authenticating user navigation
router.put('/users/teacher/:teacherId', updateTeacherAcctInfo )

module.exports = router;