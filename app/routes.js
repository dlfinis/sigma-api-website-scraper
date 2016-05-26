var controller = require('app-controller');

var sites = controller(require('./controllers/sites'));

module.exports = function(app) {
	app.get('/sites', sites.list);
  app.get('/sites/get', sites.get);
  app.get('/sites/find', sites.find);
	app.post('/sites', sites.scrape);
	app.get('/sites/:url/download', sites.download);
};
