var Services = require('./../../../service/network');
const pool = require('./../../../config/database')
const jwt = require("jsonwebtoken");
var _ = require("lodash");
const verifyEmail = async (req, res, next) => {

    try {
        const decodedtoken = jwt.decode(req.params.token, process.env.SECRET_KEY);
        const id = decodedtoken.id;

        const user = await pool.query(`SELECT * FROM mbillUsers WHERE id= '${id}'`);

        if (user.length === 0) {
            return Services._handleError(res, "Invalid Data");
        }
        if (user[0].isEmailVerified === 1) {
            return Services._handleError(res, "Invalid Link");
        }

        await pool.query(`UPDATE mbillUsers SET isEmailVerified=1 WHERE id='${id}'`)

        Services._response(res, "Email Verified Successfully");


    } catch (error) {
        Services._handleError(res, error.message);
    }
};
module.exports = { verifyEmail };