var Services = require('./../../../service/network');
var _ = require("lodash");
const pool = require('./../../../config/database')
const categoryList = async (req, res, next) => {
    try {
        const categoryList = await pool.query('SELECT * FROM category;')
        if (categoryList.length === 0) {
            return Services._handleError(res, "No Category");
        }
    
      Services._response(res,  categoryList , "Categories fetched Successfully");

    } catch (error) {
        Services._handleError(res, error.message);
    }
}
module.exports = { categoryList }