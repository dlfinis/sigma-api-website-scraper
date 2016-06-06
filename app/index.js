require('pmx').init();

var express = require('express');
var addMiddlewares = require('./middlewares');
var addRoutes = require('./routes');
var config = require('./../config/app');
var app = express();


addMiddlewares(app);
addRoutes(app);

app.listen(config.port, function () {
  console.log("Listening on " + (process.env.OPENSHIFT_NODEJS_IP || config.ipaddress) + ", server_port " + config.port );
  console.log("+ Api Scraper Init");
});
