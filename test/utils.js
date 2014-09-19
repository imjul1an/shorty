var config = require('../config');
var shortcodes = require('../source/models/shortcodes');
var middleware = require('../source/middleware');

module.exports = {
	getRootUrl: getRootUrl,
	clearCollection: clearCollection,
	createTestShortCode: createTestShortCode
};

function getRootUrl () {
	return config.applicationUrl;
}

function clearCollection (callback) {
	shortcodes.clearCollection(callback);
}

function createTestShortCode (callback) {
	middleware.generator.generate(function (err, shortcode) {
		shortcodes.create('http://example.com/very-long-url', {shortcode: 'EWB0bZ'}, function (err, shortcode) {
			if (err) {
				return callback(err);
			}
			callback(null, shortcode);
		});
	});
}
