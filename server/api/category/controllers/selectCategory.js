var Services = require("./../../../service/network");
var _ = require("lodash");
const pool = require("./../../../config/database");
const SendOTP = require("../../../service/sendSms");
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

    const data = SendOTP.sendOtp(contactNumber);
    let msg = {};
    if (data.type == "success") {
      await pool.query(
        `UPDATE mbillUsers SET isRegister=2 WHERE userId="${id}"`
      );
      msg = {
        isRegister: "Otp verification pending(2)"
      };
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
  } catch (error) {
    Services._handleError(res, error.message);
  }
};
module.exports = { selectCategory };
