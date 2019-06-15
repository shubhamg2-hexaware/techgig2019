var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var route = require('./api/routes')
var sendFBResponse = require('./api/src/sendFBMessage');
var makeFBResponse = require('./api/src/makeResponse');
global.session = [];
global.userData = [];

var port = process.env.PORT || 3000;

/**
 * To support JSON-encoded bodies.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * Routing to routes.js file
 */
app.use('/webhook', route);

app.listen(port);
console.log("Server Running Successfully at port " + port);

module.exports = app;