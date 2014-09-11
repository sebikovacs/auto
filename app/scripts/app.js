/* Adsavvy app
 */

var app = angular.module('autohack', [
	'ngRoute',
	'ngTouch'
]).config(function($routeProvider) {
	'use strict';

	$routeProvider
	.when('/quiz', {
		templateUrl: 'views/question.html',
		controller: 'QuizCtrl',
		reloadOnSearch: true
	})
	.when('/toate-intrebarile', {
		templateUrl: 'views/list.html',
		controller: 'ListQuestionsCtrl',
		reloadOnSearch: true
	})
	.when('/intrebare', {
		templateUrl: 'views/question.html',
		controller: 'QuestionCtrl',
		reloadOnSearch: true
	})
	.when('/legislatie-rutiera', {
		templateUrl: 'views/legis.html',
		controller: 'LegisCtrl',
		reloadOnSearch: false
	})
	.otherwise({
		redirectTo: '/quiz'
	});

});

app.run(function($rootScope){
	'use strict';

	var root = $rootScope.root = {};

	root.smallScreen = (screen.width <= 1024);

});
