var Services = require("./../../../service/network");
const pool = require("./../../../config/database");
const SendOtp = require("sendotp");
const sendOtp = new SendOtp("313130AUZ6pZHTJ2nk5e1dac4aP1");

var _ = require("lodash");
const verifyOtp = async (req, res) => {
  try {
    const otp = req.body.otp;
    const id = req.id;
    const userData = await pool.query(
      `SELECT contactNumber,userId,firstName,lastName,userImage,email,userToken FROM mbillUsers WHERE userId= '${id}'`
    );

    sendOtp.verify(userData[0].contactNumber, otp, async function(error, data) {
      if (error) throw error;
      if (data.type == "success") {
        await pool.query(
          `UPDATE mbillUsers SET isRegister=3 WHERE userId="${id}"`
        );
        msg = {
          isRegister: "Complete(3)",
          userData: userData[0]
        };
      } else {
        await pool.query(
          `UPDATE mbillUsers SET isRegister=2 WHERE userId="${id}"`
        );
        msg = {
          isRegister: "Otp verification pending(2)",
          userData: userData[0]
        };
      }

      Services._response(res, msg, "Successfully");
    });
  } catch (error) {
    Services._handleError(res, error.message);
  }
};

module.exports = { verifyOtp };
