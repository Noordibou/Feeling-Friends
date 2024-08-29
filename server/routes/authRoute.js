const { Signup, Login, findUser, findUserById, Logout, checkAuth, updateTeacherAcctInfo, findUserByTeacherId, updatePassword } = require('../controllers/authControllers')
const { userVerification } = require('../middleware/authMiddleware')
const { signUpValidation } = require("../middleware/index")
const router = require("express").Router();

router.post("/signup", signUpValidation, Signup);
router.post("/login", Login);
router.post('/', userVerification);
router.get('/logout', Logout)
router.get("/users", findUser);
router.get("/users/teacher/:teacherId", findUserByTeacherId)
router.get('/users/:id', findUserById)
router.get('/check-auth', checkAuth) // for authenticating user navigation
router.put('/users/password/:teacherId', updatePassword);
router.put('/users/teacher/:teacherId', updateTeacherAcctInfo )

module.exports = router;