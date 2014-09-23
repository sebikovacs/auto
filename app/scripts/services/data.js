/*
 * Data service
 */

app.factory('data', function($rootScope, $http, $q) {
	'use strict';

	// local testing urls
	var env = 'local';
	var storage = window.localStorage;

	// // dev
	// if(document.domain === 'dev.bizcardmaker.com') {
	// 	env = 'dev';
	// }

	// // stage
	// if(document.domain === 'stage.bizcardmaker.com') {
	// 	env = 'stage';
	// }

	// // live
	// if(document.domain === 'www.bizcardmaker.com') {
	// 	env = 'live';
	// }

	// if(env === 'dev') {
	// 	apiUrl = 'https://dev-bizcardmaker.rhcloud.com';
	// }

	// if(env === 'live' || env === 'stage') {
	// 	apiUrl = 'https://live-bizcardmaker.rhcloud.com';
	// 	printchompUrl = 'https://printchomp.com';
	// }

	// local model
	var model = {
		questions: {}
	};

	var GetQuestions = function () {
		var deferred = $q.defer();

		if (!$.isEmptyObject(model.questions)) {

			// if questions are already cached localy
			deferred.resolve(model.questions);

			
		} else {


			// serve questions from localstorage or fetch them from the server
			var questions = JSON.parse(storage.getItem('questions'));
			if (!$.isEmptyObject(questions) && !questions.all) {

				angular.copy(questions, model.questions);
				deferred.resolve(model.questions);

			} else {

				$http.get('/questions.json')
				.success(function(response) {
					
					angular.copy(response, model.questions);
					deferred.resolve(model.questions);

					SaveQuestions();

					

				}).error(function(err) {

					deferred.reject(err);

				});

			}

		}

		return deferred.promise;
	};

	var SaveQuestions = function () {
		var deferred = $q.defer();

		storage.setItem('questions', JSON.stringify(model.questions));

		return deferred.promise;
	};

	var RemoveQuestions = function () {
		storage.removeItem('questions');	
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
		env: env,

		model: model,
		GetQuestions: GetQuestions,
		GetLegis: GetLegis,
		SaveQuestions: SaveQuestions,
		RemoveQuestions: RemoveQuestions
	};

});
