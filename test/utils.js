var moment = require('moment');
var config = require('../config');
var db = require('../source/db')(config);

module.exports = {
	getRootUrl: function() {
		return config.applicationUrl;
	},

	clearDb: function(callback) {
		db.dropDatabase(callback);
	},

	clearCollection: function(collection, callback) {
		db[collection].remove(callback);
	},

	createTestShortCode: function(callback) {
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
	},

	getShortcode: function (shortcode, callback) {
		db.shortcodes.findOne({shortcode: shortcode}, callback);
	}
};
