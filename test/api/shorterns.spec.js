var request = require('request');
var testUtils = require('../utils');

describe('shorterns.spec.js', function () {
	var apiUrl, url, payload, error, response, result, body;

	beforeEach(function () {
		apiUrl = testUtils.getRootUrl() + '/api/shorten';
	});

	describe('when user create shortcode', function () {
		beforeEach(function () {
			url = apiUrl;
		});

		beforeEach(function (done){
			request.post({url: url, body: payload, json:true}, function (err, res, body) {
				response = res;
				body = body;
				error = err;
				done(err);
			});
		});

		describe('with wrong payload', function () {
			beforeEach(function (){
				payload = { url: 'http://example.com/very-long-url', shortcode:'1uK7tms'};
			});

			beforeEach(function(){
				url = apiUrl;
			});

			describe('and url is missing', function() {
				beforeEach(function (){
					payload = {};
				});

				it('should respond 400 (Bad Request)', function () {
					expect(response.statusCode).to.equal(400);
				});
			});
		});

		describe('with right payload', function () {
			beforeEach(function(){
				url = apiUrl;
			});

			describe('and url is present', function() {
				beforeEach(function (){
					payload = { url: 'http://example.com/very-long-url' };
				});

				beforeEach(function (done){
					request.post({url: url, body: payload, json:true}, function (err, res, body) {
						response = res;
						result = body;
						error = err;
						done(err);
					});
				});

				it('should respond 201 (Created)', function () {
					expect(response.statusCode).to.equal(201);
				});

				it('should respond with shortcode', function(){
					expect(result.shortcode).to.be.ok;
				});
			});
		});
	
		describe('with desired shortcode', function () {

			describe('and shortcode is duplicated', function () {
				beforeEach(function (){
					payload = { url: 'http://example.com/coll-url', shortcode: '1uK7tms'};
				});

				beforeEach(function (done) {
					request.post({url: url, body: payload, json:true}, function (err, res, body) {
						response = res;
						result = body;
						error = err;
						done(err);
					});
				});

				it('should respond 409 (Conflict)', function () {
					expect(response.statusCode).to.equal(409);
				});
			});

			describe('and shortcode does not meet regex expression: ^[0-9a-zA-Z_]{4,}$', function () {
				beforeEach(function (){
					payload = { url: 'http://example.com/coll-url', shortcode: '1uK&tms'};
				});

				beforeEach(function (done) {
					request.post({url: url, body: payload, json:true}, function (err, res, body) {
						response = res;
						result = body;
						error = err;
						done(err);
					});
				});

				it('should respond 422 (Conflict)', function () {
					expect(response.statusCode).to.equal(422);
				});
			});
		});
	});

	describe('when user requesting shortcode', function () {
		describe('with shortcode that exist in database', function (){
			beforeEach(function () {
				url = apiUrl + '/1uK7tms';
			});

			beforeEach(function (done) {
				request({url: url, json: true}, function (err, resp, body) {
					response = resp;
					result = body;
					done(err);
				});
			});

			it('should respond 302(Found)', function (){
				expect(response.statusCode).to.equal(302);
			});

			it('should respond with location', function(){
				expect(result.shortcode).to.be.ok;
			});
		});

		describe('with shortcode that doesn not exist in database', function () {
			beforeEach(function () {
				url = apiUrl + '/10K0tms';
			});

			beforeEach(function (done) {
				request({url: url, json: true}, function (err, resp, body) {
					response = resp;
					result = body;
					done(err);
				});
			});

			it('should respond 404(Not Found)', function (){
				expect(response.statusCode).to.equal(404);
			});
		});
	});
});