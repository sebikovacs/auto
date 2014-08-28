/* Adsavvy app
 */

var app = angular.module('autohack', [
	'ngRoute',
	'ngTouch'
]).config(function($routeProvider) {
	'use strict';

	$routeProvider
	.when('/chestionar/:id', {
		templateUrl: 'views/allquestions.html',
		controller: 'AllQuestionsCtrl',
		reloadOnSearch: false
	})
	.when('/intrebari-raspuns-corect', {
		templateUrl: 'views/list.html',
		controller: 'ListQuestionsCtrl',
		reloadOnSearch: false
	})
	.when('/intrebari-raspuns-gresit', {
		templateUrl: 'views/list.html',
		controller: 'ListQuestionsCtrl',
		reloadOnSearch: false
	})
	.when('/intrebari-marcate', {
		templateUrl: 'views/list.html',
		controller: 'ListQuestionsCtrl',
		reloadOnSearch: false
	})
	.when('/legislatie-rutiera', {
		templateUrl: 'views/legis.html',
		controller: 'LegisCtrl',
		reloadOnSearch: false
	})
	.otherwise({
		redirectTo: '/chestionar/1'
	});

});

app.run(function($rootScope){
	'use strict';

	var root = $rootScope.root = {};

	root.smallScreen = (screen.width <= 1024);

});
