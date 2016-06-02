module.exports = {
	subdirectories: [
		{directory: 'img', extensions: ['.png', '.jpg', '.jpeg', '.gif','.bmp']},
		{directory: 'js', extensions: ['.js']},
		{directory: 'css', extensions: ['.css']},
		{directory: 'fonts', extensions: ['.ttf', '.woff', '.eot', '.svg','woff2']},
		{directory: 'audio', extensions: ['.mp3']}
	],
	sources: [
		{selector: 'img:not([src^="//mc.yandex.ru/watch/"], [src^="//top-fwz1.mail.ru/counter"])', attr: 'src'},
		{selector: 'input', attr: 'src'},
		{selector: 'script', attr: 'src'},
		{selector: 'link[rel="stylesheet"]', attr: 'href'},
		{selector: 'link[rel*="icon"]',	attr: 'href'},
		{selector: 'object', attr: 'data'},
		{selector: 'embed',	attr: 'src'},
		{selector: 'param[name="movie"]', attr: 'value'},
		{selector: 'audio', attr: 'src'}
	],
	log: true,
	refresh:60
};

//Refresh 60 days
