const express = require("express")
const router = express.Router()
const userAuth = require("../../../server/middlewares/userAuth")

const { categoryList } = require("./controllers/getCategory")

router.get("/categoryList", userAuth, categoryList)
module.exports = router;