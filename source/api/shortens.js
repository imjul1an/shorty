"use strict";

var middleware = require('../middleware');
var shortcodes = require('../models/shortcodes');

module.exports = shortenService;

function shortenService(app) {
	app.post('/api/shorten',
		validateRequest,
		shortify);

	app.get('/api/shorten/:shortcode',
		byShortcode);

	// app.get('/api/shorten/:shortcode/stats',
	// 	stats);

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

		shortcode ? validate() : generate();
		
		function generate () {
			middleware.generator.generate(function (err, shortcode) {

				shortcodes.create(url, {shortcode: shortcode}, function (err, shortcode) {
					if (err) {
						return next(err);
					}

					res.json(201, {shortcode: shortcode});
				});
			});
		}

		function validate () {
			if (!middleware.generator.valid(shortcode)) {
				return next({ message:'the shortcode fails to meet the following regexp: ^[0-9a-zA-Z_]{4,}$', status: 422 });
			}

			shortcodes.findByCode(shortcode, function(err, shortcode) {
				if (err) {
					return next (err);
				}
				if (shortcode) {
					return next({ message: 'desired shortcode is already in use', status: 409});
				}
			});
		}
	}

	function byShortcode(req, res, next) {
		var shortcode = req.params.shortcode;

		shortcodes.findByCode(shortcode, function (err, shortcode) {
			if (err) {
				return next({message: 'Failed to get shortcode.', err: err, status: 500 });
			}

			if(!shortcode) {
				return next({message: 'Shortcode cannot be found.', err: err, status: 404 });
			}
			
			res.json(302, {location: shortcode.url});
		});
	}

	function stats(req, res, next) {
		var shortcode = req.params.shortcode;

		shortcodes.findByCode(shortcode, function (err, shortcode) {
			if (err) {
				return next({message: 'Failed to get shortcode.', err: err, status: 500 });
			}

			if(!shortcode) {
				return next({message: 'Shortcode cannot be found.', err: err, status: 404 });
			}
			
			res.json(200, {shortcode: shortcode});
		});
	}
}