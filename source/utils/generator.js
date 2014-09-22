"use strict";

module.exports = {
	generate: generate,
	valid: valid
};

function generate (callback) {
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_0123456789";
	var stringLength = 6;

	var shortcode = Array.apply(null, new Array(stringLength)).map(function () {
		return possible[Math.floor(Math.random() * possible.length)];
	}).join('');

	return callback (null, shortcode);
}

function valid(shortcode) {
	var pattern = /^[0-9a-zA-Z_]{4,}$/;
	return pattern.test(shortcode);
}