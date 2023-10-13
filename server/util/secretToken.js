require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id, roleId, role) => {
  return jwt.sign({ id, roleId, role }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};