function shortenService(app) {
	app.post('/api/shorten',
		validateRequest,
		shortify);

	function validateRequest (req, res, next) {
		var body = req.body;

		if(!body || !body.url) {
			return next({message: 'missing url', status: 400});
		}

		next();
	}


	function shortify (req, res, next) {
		// shortify logic goes here.
		var shortcode = 'http://bit.ly/1uK7tms';
		res.json(201, {shortcode: shortcode});
	}
}

module.exports = shortenService;