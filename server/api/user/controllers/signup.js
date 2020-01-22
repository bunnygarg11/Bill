// var Services = require("./../../../service/network");
// const OTP = require("../../../service/sendSms");
// const jwt = require("jsonwebtoken");
// const pool = require("./../../../config/database");
// const bcryptjs = require("bcryptjs");
// var _ = require("lodash");
// const signup = async (req, res, next) => {
//   try {
//     const {
//       personalDetails,
//       shopDetails,
//       paymentDetails,
//       socialId,
//       registerType
//     } = req.body;
//     // console.log(typeof(paymentDetails.onlineStore));

//     const email = await pool.query(
//       `Select email FROM mbillUsers WHERE email='${personalDetails.email}'`
//     );

//     if (email.length !== 0) {
//       return Services._handleError(res, "User already exists");
//     }

//     personalDetails.password = await bcryptjs.hash(personalDetails.password, 8);
//     const obj = paymentDetails;
//     // JSON.stringify(obj.onlineStore)
//     //obj.onlineStore='["amazonId","h"]'
//     paymentDetails.onlineStore = JSON.stringify(paymentDetails.onlineStore);
//     await pool.query("INSERT INTO mbillUsers set ?", [
//       {
//         ...personalDetails,
//         ...shopDetails,
//         ...paymentDetails,
//         socialId,
//         registerType
//       }
//     ]);
//     // await pool.query("INSERT INTO mbillUsers (onlineStore) set VALUES ?", [paymentDetails.onlineStore])

//     const userData = await pool.query(
//       `SELECT userId,firstName,lastName,userImage,email,isRegister, onlineStore FROM mbillUsers WHERE email='${personalDetails.email}'`
//     );
//     // console.log(userData[0].onlineStore)
//     // JSON.parse(userData[0].onlineStore).map(e=>{
//     //     console.log(e)
//     // })

//     const userToken = await jwt.sign(
//       { userData: userData[0].userId },
//       process.env.SECRET_KEY,
//       { expiresIn: 36000 }
//     );
//    const data= OTP.sendOtp(personalDetails.contactNumber);
//    if(data.type=="error") {
//        return Services._validationError(res,data,"Error while sending otp")
//    }
//     Services._response(
//       res,
//       { userToken, userData },
//       "You are successfully registered"
//     );
//   } catch (error) {
//     Services._handleError(res, error.message);
//   }
// };
// module.exports = { signup };

var Services = require("./../../../service/network");
const jwt = require("jsonwebtoken");
const pool = require("./../../../config/database");
const bcryptjs = require("bcryptjs");
var _ = require("lodash");
const {check,validationResult}=require("express-validator")
const schema=require("../../../middlewares/validator")

const signup = async (req, res, next) => {
  try {
   
    const {error}=schema.validate(req.body,{aboutEarly:false})
    if(error){
      console.log(error)
      return res.send()
    }
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
      return Services._handleError(res, "User already exists");}
    // } else if (registerType === "Custom") {
    //   socialId = "";
    // } else if (registerType === "Google" || registerType === "Facebook") {
    //   if (!socialId) {
    //     return Services._handleError(res, "Social Id required");
    //   } else if (
    //     shopDetails.isGstNumber === "no" ||
    //     shopDetails.isGstNumber === "No"
    //   ) {
    //     return Services._handleError(res, "GST Number required");
    //   } else if (
    //     !shopDetails.countryId ||
    //     !shopDetails.stateId ||
    //     !shopDetails.cityId
    //   ) {
    //     return Services._handleError(res, "Country,State,City are required");
    //   }
    // } else if (shopDetails.isGstNumber === "yes") {
    //   if (!shopDetails.legalName || !shopDetails.gstNumber) {
    //     return Services._handleError(
    //       res,
    //       "Legal Name and GST Number are required"
    //     );
    //   }
    // } else if (paymentDetails.isSellOnline === "yes") {
    //   if (
    //     !paymentDetails.onlineStore ||
    //     paymentDetails.onlineStore.length === 0
    //   ) {
    //     return Services._handleError(res, "Online details required");
    //   }
    // }

    // if (shopDetails.isGstNumber === "yes") {
    //   shopDetails.isGstNumber = 1;
    // } else {
    //   shopDetails.isGstNumber = 0;
    // }

    // if (paymentDetails.isSellOnline === "yes") {
    //   paymentDetails.isSellOnline = 1;
    // } else {
    //   paymentDetails.isSellOnline = 0;
    // }

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
    // await pool.query("INSERT INTO mbillUsers (onlineStore) set VALUES ?", [paymentDetails.onlineStore])

    const userData = await pool.query(
      `SELECT userId,firstName,lastName,userImage,email,isRegister FROM mbillUsers WHERE email='${personalDetails.email}'`
    );
    const userToken = await jwt.sign(
      { userData: userData[0].userId },
      process.env.SECRET_KEY,
      { expiresIn: 36000 }
    );
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
