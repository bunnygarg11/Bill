const express = require("express")
const router = express.Router()
const userAuth=require("./../../middlewares/userAuth")
const {check,validationResult}=require("express-validator")

const { signup } = require("./controllers/signup")
const { login } = require('./controllers/login');
const { changePassword } = require('./controllers/changePassword');
const { forgotPassword } = require('./controllers/forgotPassword');
// const { resetPassword } = require('./controllers/resetPassword');
const { verify } = require("./controllers/verifyPassword")
const { verifyEmail } = require("./controllers/verifyEmail")



router.get("/verifyemail/:token", verifyEmail)
router.get("/verify/:token", verify)
router.post("/register", [
    // check("name","Name is required").not().isEmpty(),
    // check("email","please include valid email").isEmail(),
    // check("password","Please enter a password with 6 or more characters").isLength({  min:6})
    check("shopDetails.*.legalName","legal Name is required").custom(((value,{req})=>{
        // req.body.shopDetails.isGstNumber==="yes"?value!="":true
        if(req.body.shopDetails.isGstNumber==="yes"||req.body.shopDetails.isGstNumber===1){
            req.body.shopDetails.isGstNumber=1
            return value!=""
        }
        return true
    })),
    check("shopDetails.*.gstNumber","Gst Number is required").custom(((value,{req})=>{
        // req.body.shopDetails.isGstNumber==="yes"?value!="":true
        if(req.body.shopDetails.isGstNumber==="yes"||req.body.shopDetails.isGstNumber===1){
            req.body.shopDetails.isGstNumber=1
            return value!=""
        }
        return true
    })),
    check("paymentDetails.*.onlineStore","Online store details required").custom(((value,{req})=>{
        req.body.paymentDetails.isSellOnline==="yes"?value!=="" && value.length!=0:true
    })),
    check("shopDetails.*.countryId","Country is required").not().isEmpty(),
    check("shopDetails.*.stateId","state is required").not().isEmpty(),
    check("shopDetails.*.cityId","city is required").not().isEmpty(),
    check("socialId","socialid is required").custom(((value,{req})=>{
     
      req.body.registerType==="Custom"?true:value!=""
    })),
],signup)
// router.post("/resetPassword", resetPassword)
router.post("/changePassword",userAuth, changePassword)
router.post("/login", login)
router.post("/forgotPassword", forgotPassword)
module.exports = router;