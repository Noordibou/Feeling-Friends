require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id, roleId) => {
  return jwt.sign({ id, roleId }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};