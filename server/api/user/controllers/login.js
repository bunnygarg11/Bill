var Services = require("./../../../service/network");
const pool = require("./../../../config/database");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
var _ = require("lodash");
const login = async (req, res, next) => {
  const { email, password, userName, loginType, socialId } = req.body;

  try {
    if (loginType === "Google" || loginType === "Facebook") {
      if (socialId === "") {
        return Services._handleError(res, "Social Id is required");
      } else {
        const userData = await pool.query(
          `SELECT userId,firstName,lastName,userImage,email,isRegister FROM mbillUsers WHERE socialId='${socialId}'`
        );
        if (userData.length === 0) {
          return Services._handleError(res, "Invalid credentials");
        }
        const userToken = await jwt.sign(
          { userData: userData[0].userId },
          process.env.SECRET_KEY,
          { expiresIn: 36000 }
        );
        Services._response(res, { userToken, userData }, "Login Successfully");
      }
    } else if (loginType === "Custom" || loginType === "custom") {
      const user = await pool.query(
        `SELECT * FROM mbillUsers WHERE email= '${email}' OR userName='${userName}'`
      );
      if (user.length === 0) {
        return Services._handleError(res, "Invalid credentials");
      }
      const isMatch = await bcryptjs.compare(password, user[0].password);
      if (!isMatch) {
        return Services._handleError(res, "Invalid credentials");
      }

      const userData = await pool.query(
        `SELECT userId,firstName,lastName,userImage,email,isRegister FROM mbillUsers WHERE email='${email}' OR userName='${userName}'`
      );
      const userToken = await jwt.sign(
        { userData: userData[0].userId },
        process.env.SECRET_KEY,
        { expiresIn: 36000 }
      );
      await pool.query(`UPDATE mbillUsers SET userToken='${userToken}' WHERE email='${personalDetails.email}'OR userName='${userName}'`)

      Services._response(res, { userToken, userData }, "Login Successfully");
    }
  } catch (error) {
    Services._handleError(res, error.message);
  }
};
module.exports = { login };
