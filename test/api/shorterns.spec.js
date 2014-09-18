var request = require('request');
var testUtils = require('../utils');

describe('shorterns.spec.js', function () {
	var apiUrl, url, payload, headers, error, response, result;

	beforeEach(function () {
		apiUrl = testUtils.getRootUrl() + '/api/shorten';
	});

	describe('when create request to short the link', function () {
		beforeEach(function(){
			url = apiUrl;
		});

		describe('and url is missing', function() {
			beforeEach(function (){
				payload = {};
			});
		});

		beforeEach(function (done){
			request.post({url: url, body: payload, json:true}, function (err, res, body) {
				response = res;
				body = body;
				error = err;
				done(err);
			});
		});

		it('should respond 400 (Bad Request)', function () {
			expect(response.statusCode).to.equel(400);
		});

	});
});