const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");


// FIXME: I don't think this is actually being used. Ran a console log in here and clicked on the site: nothing.
module.exports.userVerification = (req, res) => {
  const token = req.cookies.token
  console.log("hey is this userVerification function being called?")
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
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
