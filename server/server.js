const express = require('express');
const expressApp = express();
const bodyParser = require('body-parser'); // for parsing the body of a POST request
const formidableMiddleware = require('express-formidable');
// var cors = require('cors');
var mammoth = require("mammoth");

const port = 8000;

// Add headers
expressApp.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', null);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
expressApp.use(formidableMiddleware());
//expressApp.use(bodyParser.urlencoded({ extended: true }));

// looks for index.js and returns its contents, which consists of each available route.
require('./routes')(expressApp);

expressApp.listen(port, () => {
	console.log('Live on port ' + port);
});

