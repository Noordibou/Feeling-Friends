const User = require("../models/User");
const { createSecretToken } = require("../util/secretToken");
const bcrypt = require("bcryptjs");

const Signup = async (req, res, next) => {
  try {
    const { email, password, username, role, createdAt } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const user = await User.create({ email, password, username, role, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};

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

    // Check the user's role and redirect accordingly
    let redirectPath = '/';
    if (user.role === 'student') {
      redirectPath = '/student-home';
    } else if (user.role === 'teacher') {
      redirectPath = '/teacher-home';
    }

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    
    // Send a response indicating the successful login and the redirect path
    res.status(201).json({ message: "User logged in successfully", success: true, redirectPath });
  } catch (error) {
    console.error(error);
  }
};


module.exports = {
  Signup,
  Login,
};
