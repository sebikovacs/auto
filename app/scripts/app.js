/* Adsavvy app
 */

var app = angular.module('autohack', [
	'ngRoute',
	'ngTouch'
]).config(function($routeProvider) {
	'use strict';

	$routeProvider
	.when('/toate-intrebarile', {
		templateUrl: 'views/allquestions.html',
		controller: 'AllQuestionsCtrl',
		reloadOnSearch: false
	}).otherwise({
		redirectTo: '/'
	});

});

app.run(function($rootScope){
	'use strict';

	var root = $rootScope.root = {};

	root.smallScreen = (screen.width <= 1024);

});
