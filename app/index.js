require('pmx').init();

var express = require('express');
var addMiddlewares = require('./middlewares');
var addRoutes = require('./routes');
var config = require('./../config/app');
var fs    = require('fs'),
    path  = require('path');
var app = express();


var mkdirpSync = function (dirpath) {
  var parts = dirpath.split(path.sep);
  for( var i = 1; i <= parts.length; i++ ) {
    mkdirSync( path.join.apply(null, parts.slice(0, i)) );
  }
}


mkdirpSync('public/files');

addMiddlewares(app);
addRoutes(app);

app.listen(config.port);
