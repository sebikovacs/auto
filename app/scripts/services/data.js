/*
 * Data service
 */

app.factory('data', function($rootScope, $http, $q) {
	'use strict';

	// local testing urls
	var printchompUrl = 'http://sandbox.printchomp.com';
	var apiUrl = 'http://localhost:8080';
	var env = 'local';

	// dev
	if(document.domain === 'dev.bizcardmaker.com') {
		env = 'dev';
	}

	// stage
	if(document.domain === 'stage.bizcardmaker.com') {
		env = 'stage';
	}

	// live
	if(document.domain === 'www.bizcardmaker.com') {
		env = 'live';
	}

	if(env === 'dev') {
		apiUrl = 'https://dev-bizcardmaker.rhcloud.com';
	}

	if(env === 'live' || env === 'stage') {
		apiUrl = 'https://live-bizcardmaker.rhcloud.com';
		printchompUrl = 'https://printchomp.com';
	}

	// local model
	var model = {
		offers: []
	};

	var GetQuestions = function () {
		var deferred = $q.defer();

		$http.get('/questions.json')
		.success(function(response) {
			
			deferred.resolve(response);

		}).error(function(err) {

			deferred.reject(err);

		});

		return deferred.promise;
	};


	var GetLegis = function () {
		var deferred = $q.defer();

		$http.get('/legis.json')
		.success(function(response) {
			
			deferred.resolve(response);

		}).error(function(err) {

			deferred.reject(err);

		});

		return deferred.promise;
	};
	

	return {
		printchompUrl: printchompUrl,
		env: env,

		model: model,
		GetQuestions: GetQuestions,
		GetLegis: GetLegis
	};

});
