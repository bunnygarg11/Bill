var Services = require("./../../../service/network");
const jwt = require("jsonwebtoken");
const pool = require("./../../../config/database");
const mailer = require("../../../service/mailer");
const cookie = require("cookie-parser");
var _ = require("lodash");
const bcryptjs = require("bcryptjs");

const verify = async (req, res, next) => {
  try {
    const decodedtoken = jwt.decode(req.params.token, process.env.SECRET_KEY);
    const id = decodedtoken.id;

    const user = await pool.query(
      `SELECT * FROM mbillUsers WHERE userId= '${id}'`
    );

    if (user.length === 0) {
      return Services._handleError(res, "User does not exists");
    }

    res.cookie("token", req.params.token);

    return res.redirect(`http://localhost:3210/api/user/resetpassword`);
  } catch (error) {
    return Services._handleError(res, error);
  }
};
module.exports = { verify };
