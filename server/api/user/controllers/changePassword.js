var Services = require('./../../../service/network');
const bcryptjs = require("bcryptjs");
const pool = require('./../../../config/database');
var _ = require("lodash");
const changePassword = async (req, res, next) => {

    try {
        let { currentPassword, newPassword, confirmPassword } = req.body
        const user = await pool.query(`SELECT * FROM mbillUsers WHERE id= '${req.id}'`)
        if (user.length === 0) {
            return Services._handleError(res, "Invalid credentials");
        }

        // Check password
        const isMatch = await bcryptjs.compare(currentPassword, user[0].password)
        if (!isMatch) {
            return Services._handleError(res, "Invalid credentials");
        }


        newPassword = await bcryptjs.hash(newPassword, 8);

        await pool.query(`UPDATE mbillUsers SET password='${newPassword}' , confirmPassword='${confirmPassword}' WHERE id='${req.id}'`)

        return Services._response(res, {}, "Password Changed Successfully");


    } catch (error) {
        return Services._handleError(res, error.message);
    }
};
module.exports = { changePassword };