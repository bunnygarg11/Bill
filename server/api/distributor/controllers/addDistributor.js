var Services= require('./../../../service/network')
const pool = require('./../../../config/database')
var _ = require("lodash");
const addDistributor = async (req, res, next) => {
    try {

        await pool.query("INSERT INTO distributors set ?", [req.body])

        Services._response(res, {},"Distributor added successfully");
       
    } catch (error) {
       Services._handleError(res, error);
     }

}
module.exports = { addDistributor }
