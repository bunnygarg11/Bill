var Services = require("./../../../service/network");
const OTP = require("../../../service/sendSms");
const jwt = require("jsonwebtoken");
const pool = require("./../../../config/database");
const bcryptjs = require("bcryptjs");
var _ = require("lodash");
const signup = async (req, res, next) => {
  try {
    const {
      personalDetails,
      shopDetails,
      paymentDetails,
      socialId,
      registerType
    } = req.body;
    // console.log(typeof(paymentDetails.onlineStore));

    const email = await pool.query(
      `Select email FROM mbillUsers WHERE email='${personalDetails.email}'`
    );

    if (email.length !== 0) {
      return Services._handleError(res, "User already exists");
    }

    personalDetails.password = await bcryptjs.hash(personalDetails.password, 8);
    const obj = paymentDetails;
    // JSON.stringify(obj.onlineStore)
    //obj.onlineStore='["amazonId","h"]'
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
    // await pool.query("INSERT INTO mbillUsers (onlineStore) set VALUES ?", [paymentDetails.onlineStore])

    const userData = await pool.query(
      `SELECT userId,firstName,lastName,userImage,email,isRegister, onlineStore FROM mbillUsers WHERE email='${personalDetails.email}'`
    );
    // console.log(userData[0].onlineStore)
    // JSON.parse(userData[0].onlineStore).map(e=>{
    //     console.log(e)
    // })

    const userToken = await jwt.sign(
      { userData: userData[0].userId },
      process.env.SECRET_KEY,
      { expiresIn: 36000 }
    );
   const data= OTP.sendOtp(personalDetails.contactNumber);
   if(data.type=="error") {
       return Services._validationError(res,data,"Error while sending otp")
   }
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
