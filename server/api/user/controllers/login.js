var Services = require("./../../../service/network");
const pool = require("./../../../config/database");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
var _ = require("lodash");
const login = async (req, res, next) => {
  const { email, password, userName, loginType } = req.body;

  try {
    const user = await pool.query(
      `SELECT * FROM mbillUsers WHERE email= '${email}' OR userName='${userName}'`
    );
    if (user.length === 0) {
      return Services._handleError(res, "Invalid credentials");
    } else if (loginType === "Google" || loginType === "Facebook") {
      Services._response(res, {}, "Email and password not required");
    }
    const isMatch = await bcryptjs.compare(password, user[0].password);
    if (!isMatch) {
      return Services._handleError(res, "Invalid credentials");
    }
   
    const userData = await pool.query(
      `SELECT userId,firstName,lastName,userImage,email,isRegister FROM mbillUsers WHERE email='${email}'`
    );
    const userToken = await jwt.sign(
      { userData: userData[0].userId },
      process.env.SECRET_KEY,
      { expiresIn: 36000 }
    );
    Services._response(res, { userToken, userData }, "Login Successfully");
  } catch (error) {
    Services._handleError(res, error.message);
  }
};
module.exports = { login };
