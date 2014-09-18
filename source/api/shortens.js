"use strict";

var middleware = require('../middleware');
var shortcodes = require('../models/shortcodes');

module.exports = shortenService;

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
		var url = req.body.url;
		var shortcode = req.body.shortcode;

		if(shortcode) {
			shortcodes.findByCode(shortcode, function(err, shortcode) {
				if (err) {
					return next (err);
				}
				if (shortcode) {
					return next({message: 'desired shortcode is already in use', status: 409});
				}
			});
		}

		generate();

		function generate() {
			middleware.generator.generate(function (err, shortcode) {
				shortcodes.create(url, {shortcode: shortcode}, function (err, shortcode) {
					if (err) {
						return next(err);
					}

					res.json(201, {shortcode: shortcode});
				});
			});
		}
	}
}