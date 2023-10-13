const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");


module.exports.userVerification = (req, res) => {
  const token = req.cookies.token
  console.log("what is this token in authMiddle? " + token)
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    console.log("decoded: " + JSON.stringify(data))
    if (err) {
     return res.json({ status: false })
    } else {
      const user = await User.findById(data.id)
      if (user) {
      return res.json({ status: true, user: user.username })
    } else return res.json({ status: false })
    }
  })
}
