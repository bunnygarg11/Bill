/**
 * Main application routes
 */

'use strict';
const express = require("express")
const router = express.Router()
var path = require('path');

module.exports = function (app) {

    const swaggerUi = require('swagger-ui-express');
    const swaggerDocument = require('./../swagger.json');

    app.use('/api', swaggerUi.serve);
    app.get('/api', swaggerUi.setup(swaggerDocument));
    // Insert routes below
    app.use('/api/user', require('./api/user'));
    app.use('/api/distributor', require('./api/distributor'));
    app.use('/api/category', require('./api/category'));

    // All other routes should redirect to the index.html
    // app.route('/*')
    //     .get(function (req, res) {
    //         if (process.env.NODE_ENV == "development")
    //             res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    //         if (process.env.NODE_ENV == "production")
    //             res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    //     });
};