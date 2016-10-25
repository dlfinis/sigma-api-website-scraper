var defaults = require('../config/scraper');
var config = require('../config/files');
var _ = require('lodash');
var Promise = require('bluebird');
var url = require('url');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var format = require('string-template');
var scraper = require('sigma-website-scraper');


function getDiffDays ( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Dates in milliseconds

  // Calculate the difference in milliseconds
  var difference_ms = date2 - date1;

  // Convert back to days and return
  return Math.round(difference_ms/one_day);
}

function getSiteRawDirname (siteUrl) {
	var urlObj = url.parse(siteUrl);
	var domain = urlObj.host;
	var path = urlObj.path.replace(new RegExp('/', 'g'), '_7-_');
  path = urlObj.path.replace(new RegExp('&', 'g'), '_8-_');
	path = urlObj.path.replace(new RegExp('?', 'g'), '_9-_');
	return {
		domain : domain,
		path : path,
		createdAt : new Date().getTime()
	};
}

function getSiteDirname (siteUrl) {
	var rawName = getSiteRawDirname(siteUrl);
	return rawName.domain+'-'+rawName.path+'-'+rawName.createdAt;
}

function getSiteFullPath (siteDirname) {
	return path.resolve(config.directory, siteDirname);
}

function getSitesDirectories() {
	var root = config.directory;
	var directories = [];
	return fs.readdirAsync(root).then(function(files) {
		return Promise.map(files, function(file) {
			return fs.statAsync(root + '/' + file).then(function(stat){
				if (stat.isDirectory()) {
					directories.push(file);
				}
			});
		}).then(function() {
			return Promise.resolve(directories);
		});
	});
}

function buildSiteObject(directory) {
	return {
		directory: directory,
		previewPath: format(config.previewPath, {directory: directory}),
		downloadPath: format(config.downloadPath, {directory: directory})
	}
}

function getNotFoundError(directory) {
	return {
		errors: {
			directory: 'Site ' + directory + ' was not found'
		}
	};
}

var service = {
	scrape: function scrape(options) {
		var siteDirname = getSiteDirname(options.url);
		var siteFullPath = getSiteFullPath(siteDirname);

		var scraperOptions = _.extend({}, defaults, {
			urls: [options.url],
			directory: siteFullPath
			// If defaults object has request property, it will be superseded by options.request
			// request: options.request
		});
		return scraper.scrape(scraperOptions).then(function() {
			console.log('+ End Site scrape');
			return Promise.resolve(buildSiteObject(siteDirname));
		});
		return Promise.resolve(true);
	},

	list: function list() {
		return getSitesDirectories().then(function (directories) {
			var list = directories.map(buildSiteObject);
			list = _.sortBy(list, ['directory']).reverse();
			return Promise.resolve(list);
		});
	},

	find: function find(url) {
	 var siteDirname = getSiteRawDirname(url);
	 var dirname = siteDirname.domain+'-'+siteDirname.path;
		return getSitesDirectories().then(function (directories) {
			directories = _.sortBy(directories, ['directory']).reverse();
			var found = _.find(directories, function(el) {
				var odirname = el.substring(0,el.lastIndexOf('-'));
				return odirname === dirname;
			});

			if (!found) {
				return Promise.reject(getNotFoundError(dirname));
			}

			return Promise.resolve(buildSiteObject(found));
		})
	},

	get: function get(url) {
	 var siteDirname = getSiteRawDirname(url);
	 var dirname = siteDirname.domain+'-'+siteDirname.path;
	 var timeNow = new Date().getTime();
		return getSitesDirectories().then(function (directories) {
			directories = _.sortBy(directories, ['directory']).reverse();
			var found = _.find(directories, function(el) {
				var odirname = String(el).substring(0,el.lastIndexOf('-'));
				var ocreatedAt = el.substring(el.lastIndexOf('-')+1) || new Date().getTime();
				return odirname === dirname && getDiffDays(ocreatedAt,timeNow) <= defaults.refresh ;
			});

			if (!found) {
				return Promise.reject(getNotFoundError(found));
			}

			return Promise.resolve(buildSiteObject(found));
		})
	},
	check: function check(url) {
	 var siteDirname = getSiteRawDirname(url);
	 var dirname = siteDirname.domain+'-'+siteDirname.path;
	 var timeNow = new Date().getTime();
		return getSitesDirectories().then(function (directories) {
			directories = _.sortBy(directories, ['directory']).reverse();
			var found = _.find(directories, function(el) {
				var odirname = String(el).substring(0,el.lastIndexOf('-'));
				var ocreatedAt = el.substring(el.lastIndexOf('-')+1) || new Date().getTime();
				return odirname === dirname && getDiffDays(ocreatedAt,timeNow) <= defaults.refresh ;
			});

			console.log('+'+(!found ? 'Not':'')+'Site >'+'\n'+JSON.stringify(found ? found : '[]'));
			if (!found) {
				return service.scrape({url:url});
			}

			return Promise.resolve(buildSiteObject(found));
		})
	},

	getFullPath: function getFullPath(url) {
		var siteDirname = getSiteRawDirname(url);
		var dirname = siteDirname.domain+'-'+siteDirname.path;
		return getSitesDirectories().then(function (directories) {
			directories = _.sortBy(directories, ['directory']).reverse();
			var found = _.find(directories, function(el) {
				var odirname = String(el).substring(0,el.lastIndexOf('-'));
				return odirname === dirname;
			});

			if (!found) {
				return Promise.reject(getNotFoundError(dirname));
			}

			return Promise.resolve(getSiteFullPath(found));

		});
	}
};

module.exports = service;
