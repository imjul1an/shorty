var moment = require('moment');
var config = require('../config');
var db = require('../source/db')(config);

module.exports = {
	getRootUrl: getRootUrl,
	clearDb: clearDb,
	clearCollection: clearCollection,
	createTestShortCode: createTestShortCode,
	getShortcode: getShortcode
};

function getRootUrl () {
	return config.applicationUrl;
}

function clearDb (callback) {
	db.dropDatabase(callback);
}

function clearCollection (collection, callback) {
	db[collection].remove(callback);
}

function createTestShortCode (callback) {
	var shortcode = {
		url: "http://example.com/very-long-url",
		startDate: moment().toDate(),
		lastSeenDate: moment().toDate(),
		redirectCount: 0
	};

	db.shortcodes.save(shortcode, function (err, shortcode) {
		if (err) {
			return callback(err);
		}

		callback(null, shortcode, shortcode);
	});
}

function getShortcode (shortcode, callback) {
	db.shortcodes.findOne({shortcode: shortcode}, callback);
}
