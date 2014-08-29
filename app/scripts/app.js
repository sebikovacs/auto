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
	.when('/intrebari', {
		templateUrl: 'views/list.html',
		controller: 'ListQuestionsCtrl',
		reloadOnSearch: true
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
