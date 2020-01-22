var Services = require("./../../../service/network");
var _ = require("lodash");
const pool = require("./../../../config/database");
const SendOTP = require("../../../service/sendSms");
const selectCategory = async (req, res, next) => {
  try {
    const id = req.id;
    const contactNumber = await pool.query(
      `SELECT contactNumber FROM mbillUsers WHERE userId= '${id}'`
    );
    await pool.query("INSERT INTO category set ?", [req.body]);
    Services._response(res, {}, "Distributor added successfully");

    SendOTP.sendOtp(contactNumber);
  } catch (error) {
    Services._handleError(res, error);
  }
};
module.exports = { selectCategory };
