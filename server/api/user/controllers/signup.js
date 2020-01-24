var Services = require("./../../../service/network");
const jwt = require("jsonwebtoken");
const pool = require("./../../../config/database");
const bcryptjs = require("bcryptjs");
var _ = require("lodash");
const signup = async (req, res, next) => {
  try {
    let {
      personalDetails,
      shopDetails,
      paymentDetails,
      socialId,
      registerType
    } = req.body;
    const email = await pool.query(
      `Select email FROM mbillUsers WHERE email='${personalDetails.email}'`
    );
    if (email.length !== 0) {
      return Services._handleError(res, "User already exists");
    } else if (registerType === "Custom") {
      socialId = "";
    } else if (registerType === "Google" || registerType === "Facebook") {
      if (!socialId) {
        return Services._handleError(res, "Social Id required");
      } else if (
        shopDetails.isGstNumber === "no" ||
        shopDetails.isGstNumber === "No"
      ) {
        return Services._handleError(res, "GST Number required");
      } else if (
        !shopDetails.countryId ||
        !shopDetails.stateId ||
        !shopDetails.cityId
      ) {
        return Services._handleError(res, "Country,State,City are required");
      }
    } else if (shopDetails.isGstNumber === "yes") {
      if (!shopDetails.legalName || !shopDetails.gstNumber) {
        return Services._handleError(
          res,
          "Legal Name and GST Number are required"
        );
      }
    } else if (paymentDetails.isSellOnline === "yes") {
      if (
        !paymentDetails.onlineStore ||
        paymentDetails.onlineStore.length === 0
      ) {
        return Services._handleError(res, "Online details required");
      }
    }

    if (shopDetails.isGstNumber === "yes") {
      shopDetails.isGstNumber = 1;
    } else {
      shopDetails.isGstNumber = 0;
    }

    if (paymentDetails.isSellOnline === "yes") {
      paymentDetails.isSellOnline = 1;
    } else {
      paymentDetails.isSellOnline = 0;
    }

    personalDetails.password = await bcryptjs.hash(personalDetails.password, 8);

    paymentDetails.onlineStore = JSON.stringify(paymentDetails.onlineStore);
    await pool.query("INSERT INTO mbillUsers set ?", [
      {
        ...personalDetails,
        ...shopDetails,
        ...paymentDetails,
        socialId,
        registerType
      }
    ]);

    const userData = await pool.query(
      `SELECT userId,firstName,lastName,userImage,email,isRegister FROM mbillUsers WHERE email='${personalDetails.email}'`
    );
    const userToken = await jwt.sign(
      { userData: userData[0].userId },
      process.env.SECRET_KEY,
      { expiresIn: 36000 }
    );

    await pool.query(`UPDATE mbillUsers SET userToken='${userToken}' WHERE email='${personalDetails.email}'`)


    Services._response(
      res,
      { userToken, userData },
      "You are successfully registered"
    );
  } catch (error) {
    Services._handleError(res, error.message);
  }
};
module.exports = { signup };
