var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('../config/app');

module.exports = function(app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(config.staticPath, express.static(path.resolve(__dirname, '../public')));
	app.get(config.staticPath + '/*', function(req, res) {
		res.status(404).send('Not found');
	});

};
