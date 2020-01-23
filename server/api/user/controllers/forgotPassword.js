var Services = require("./../../../service/network");
const pool = require("./../../../config/database");
const mailer = require("../../../service/mailer");
const jwt = require("jsonwebtoken");
var _ = require("lodash");
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await pool.query(
      `SELECT * FROM mbillUsers WHERE email= '${email}'`
    );
    if (user.length === 0) {
      return Services._handleError(res, "Invalid credentials");
    }
    const token = await jwt.sign(
      { id: user[0].userId },
      process.env.SECRET_KEY,
      { expiresIn: 36000 }
    );

    const userEmail = user[0].email;
    const verify = `Click on the link http://localhost:${process.env.PORT ||
      3210}/api/user/verify/${token}`;
    await mailer(userEmail, verify);
    Services._response(
      res,
      {},
      "Mail has been sent your registered email.Please check and reset your password"
    );
    // next();
  } catch (error) {
    Services._handleError(res, error.message);
  }
};

module.exports = { forgotPassword };
