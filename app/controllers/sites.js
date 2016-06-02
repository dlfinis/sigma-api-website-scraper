var Archiver = require('archiver');
var sites = require('../../core/sites');

module.exports = {
	scrape: sites.scrape,
	list: sites.list,
	check: function (params,req,res) {
		return sites.check(params.url);
	},
	get: function (params,req,res) {
		return sites.get(params.url);
	},
	find: function(params) {
		return sites.find(params.url);
	},
	//Necessary review in the generation of dirname based in SiteUrl
	download: function scrape(params, req, res) {
		return sites.getFullPath(params.url).then(function(fullPath) {
			// res.writeHead(200, {
			// 	'Content-Type': 'application/zip',
			// 	'Content-disposition': 'attachment; filename=' + params.url + '.zip'
			// });

			// var zip = Archiver('zip');
			// zip.pipe(res);
			// zip.directory(fullPath, false).finalize();
			console.log(fullPath);
		});
	}
};
