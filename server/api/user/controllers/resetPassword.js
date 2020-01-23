var Services = require("./../../../service/network");
const bcryptjs = require("bcryptjs");
const pool = require("./../../../config/database");
const jwt = require("jsonwebtoken");
var _ = require("lodash");
const resetPassword = async (req, res, next) => {
  try {
    const token = req.headers["resettoken"];
    const decodedtoken = jwt.decode(token, "secretKey");
    const { id } = decodedtoken;
    let { newPassword, confirmPassword } = req.body;
    const user = await pool.query(
      `SELECT * FROM mbillUsers WHERE userId= '${id}'`
    );
    if (user.length === 0) {
      return Services._handleError(res, "", "Token Invalid");
    }

    if (newPassword ===confirmPassword) {
      newPassword = await bcryptjs.hash(newPassword, 8);
      await pool.query(
        `UPDATE mbillUsers SET password='${newPassword}' WHERE userId='${id}'`
      );
      return Services._response(res, {}, "Password Set succesfully");
    }
    Services._validationError(res, "", "password does not match");
  } catch (error) {
    Services._handleError(res, error.message, "Server error in reset password");
  }
};
module.exports = { resetPassword };
