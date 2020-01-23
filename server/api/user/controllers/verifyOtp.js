var Services = require("./../../../service/network");
const SendOTP = require("../../../service/sendSms");
const pool = require("./../../../config/database");
var _ = require("lodash");
const verifyOtp = async (req, res) => {
  try {
    const otp = req.body.otp;
    const id = req.id;
    const userData = await pool.query(
      `SELECT contactNumber,userId,firstName,lastName,userImage,email FROM mbillUsers WHERE userId= '${id}'`
    );
    const data = SendOTP.verifyOTP(userData.contactNumber, otp);

    if (data.type == "success") {
      await pool.query(
        `UPDATE mbillUsers SET isRegister=3 WHERE userId="${id}"`
      );
      msg = {
        isRegister: "Complete(3)",
        userData: userData
      };
    } else {
      await pool.query(
        `UPDATE mbillUsers SET isRegister=2 WHERE userId="${id}"`
      );
      msg = {
        isRegister: "Otp verification pending(2)",
        userData: userData
      };
    }

    Services._response(res, msg, "Successfully");
  } catch (error) {
    Services._handleError(res, error.message);
  }
};

module.exports = { verifyOtp };
