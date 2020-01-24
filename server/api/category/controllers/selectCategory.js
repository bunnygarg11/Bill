var Services = require("./../../../service/network");
const SendOtp = require("sendotp");

var _ = require("lodash");
const pool = require("./../../../config/database");
const selectCategory = async (req, res, next) => {
  try {
    const id = req.id;
    const selectedCategory = req.body.selectedCategory;

    await pool.query(
      "INSERT INTO category (categoryId,categoryName) VALUES ?",
      [selectedCategory.map(cate => [cate.categoryId, cate.categoryName])]
    );
    const contactNumber = await pool.query(
      `SELECT contactNumber FROM mbillUsers WHERE userId= '${id}'`
    );

    let msg = {};

    const sendOtp = new SendOtp(
      "313130AUZ6pZHTJ2nk5e1dac4aP1",
      "Otp for your order is {{otp}}, please do not share it with anyone"
    );
    sendOtp.setOtpExpiry("90");
    sendOtp.send(contactNumber[0].contactNumber, "", async function(
      error,
      data
    ) {
      if (error) throw error;

      if (data.type == "success") {
        msg.isRegister = "Otp verification pending(2)";

        await pool.query(
          `UPDATE mbillUsers SET isRegister=2 WHERE userId="${id}"`
        );
      } else {
        msg = {
          isRegister: "partial(1)"
        };
      }

      Services._response(
        res,
        msg,
        "Otp has been sent on registered mobile number"
      );
    });
    
  } catch (error) {
    Services._handleError(res, error.message);
  }
};
module.exports = { selectCategory };
