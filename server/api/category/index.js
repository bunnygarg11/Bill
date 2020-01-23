const express = require("express")
const router = express.Router()
const userAuth = require("../../../server/middlewares/userAuth")

const { categoryList } = require("./controllers/getCategory")
const { selectCategory} = require("./controllers/selectCategory")

router.get("/categoryList", userAuth, categoryList)
router.post("/selectCategory", userAuth, selectCategory)
module.exports = router;