
const express = require("express")
const router = express.Router()
const userAuth=require("./../../middlewares/userAuth")

const { signup } = require("./controllers/signup")
const { login } = require('./controllers/login');
const { changePassword } = require('./controllers/changePassword');
const { forgotPassword } = require('./controllers/forgotPassword');
const { resetPassword } = require('./controllers/resetPassword');
const { verify } = require("./controllers/verifyPassword")
const { verifyEmail } = require("./controllers/verifyEmail")
const { verifyOtp } = require("./controllers/verifyOtp")


router.get("/verifyemail/:token", verifyEmail)
router.get("/verify/:token", verify)
router.post("/register", signup)
router.post("/resetPassword", resetPassword)
router.post("/changePassword",userAuth, changePassword)
router.post("/login", login)
router.post("/forgotPassword", forgotPassword)
router.post("/otpVerification",userAuth,verifyOtp )
module.exports = router;