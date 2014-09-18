"use strict";

var _ = require('underscore');
var moment = require('moment');
var config = require('../../config');
var db = require('../db')(config);
var ObjectId = require('mongojs').ObjectId;

module.exports = {
	create: create,
	findById: findById,
	findByCode: findByCode
};

function create (url, shortcode, callback) {
	var ext =  { url: url, startDate: moment().toDate(), lastSeenDate: moment().toDate(), redirectCount: 0};
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