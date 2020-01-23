var Services = require('./../service/network');
var _ = require("lodash");
const jwt = require("jsonwebtoken")
module.exports = function (req, res, next) {
    const token = req.header("x-auth-token")
    if (!token) {
        return Services._handleError(res, "No token,authorization failed" );
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.id = decoded.userData 
        next()

    } catch (error) {
        Services._handleError(res, error.message, "Token is not valid");
    }
}