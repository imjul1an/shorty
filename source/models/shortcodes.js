"use strict";

var _ = require('underscore');
var moment = require('moment');
var config = require('../../config');
var db = require('../db')(config);
var ObjectId = require('mongojs').ObjectId;

module.exports = {
	create: create,
	update: update,
	findById: findById,
	findByCode: findByCode,
	clearCollection: clearCollection
};

function create (url, shortcode, callback) {
	var ext =  { url: url, startDate: moment().toDate(), redirectCount: 0};
	shortcode = _.extend(shortcode, ext);
	db.shortcodes.save(shortcode, callback);
}

function findById (id, callback) {
	if (typeof id === 'string') {
		id = new ObjectId(id);
	}

	db.shortcodes.findOne({_id: id}, callback);
}

function findByCode (shortcode, callback) {
	db.shortcodes.findOne({shortcode: shortcode}, callback);
}

function clearCollection (callback) {
	db.shortcodes.remove(callback);
}

function update(shortcode, callback) {
	db.shortcodes.update({shortcode: shortcode}, {$set: {lastSeenDate: moment().toDate()}}, function (err, count) {
		if (err) {
			return callback(err);
		}

		db.shortcodes.findAndModify({
			query: {shortcode: shortcode},
			update: {$inc: {redirectCount: 1}},
			'new': true
		}, callback);
	});
}