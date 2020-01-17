const express = require("express")
const router = express.Router()
const userAuth = require("../../../server/middlewares/userAuth")

const { addDistributor } = require("./controllers/addDistributor")

router.post("/addDistributor",userAuth, addDistributor)
module.exports = router;