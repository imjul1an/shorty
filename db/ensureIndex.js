var config = require('../config');
var db = require('../source/db')(config);

db.shortcodes.ensureIndex({'shortcode': 1}, {'unique': true}, function (err) {
	if (err) {
		return console.error('failed to initialize index', JSON.stringify(err));
	}

	db.close(function () {
		console.log('index ensured');
	});
});
