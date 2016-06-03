require('pmx').init();

var express = require('express');
var addMiddlewares = require('./middlewares');
var addRoutes = require('./routes');
var config = require('./../config/app');
var app = express();

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;


addMiddlewares(app);
addRoutes(app);

app.listen(port,ipaddress, function () {
  console.log("Listening on " + server_ip_address + ", server_port " + port );
  console.log("Api Scraper Init");
});
