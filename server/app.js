var path = require('path');
var dotenv = require('dotenv').config(path.resolve(process.cwd(), './.env'));
const port = process.env.PORT || 3210;
const express = require('express');

const app = express();


app.use(express.json())
require('./routes')(app)


app.listen(port, () => {
    console.log('Server is running at port ' + port)
})
exports=module.exports = app;