var Services = require('./../../../service/network');
const jwt = require("jsonwebtoken");
const pool = require("./../../../config/database");
const mailer = require("../../../service/mailer");
var _ = require("lodash");
const bcryptjs = require("bcryptjs");

const verify = async (req, res, next) => {
    try {
        const decodedtoken = jwt.decode(req.params.token, process.env.SECRET_KEY);
        const id = decodedtoken.id;

        const user = await pool.query(`SELECT * FROM mbillUsers WHERE id= '${id}'`);

        if (user.length === 0) {
            return Services._handleError(res, "User does not exists");
        }

        const userEmail = user[0].email;

        const password = user[0].firstName + 2020;
        const verify =` Your temporary password is ${password}`;
        await mailer(userEmail, verify);

        const hashedpassword = await bcryptjs.hash(password, 8);
        await pool.query(
            `UPDATE mbillUsers SET password='${hashedpassword}' , confirmPassword='${password}' WHERE id= '${id}'`
        );

        return Services._response(res, "Mail Sent");
    } catch (error) {
        return Services._handleError(res, error);
    }
};
module.exports = { verify };