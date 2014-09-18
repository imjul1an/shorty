"use strict";

var config = require('../config');

module.exports = {
	getRootUrl: function() {
		return config.applicationUrl;
	}
};
