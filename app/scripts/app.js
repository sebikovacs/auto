/* Adsavvy app
 */

var app = angular.module('autohack', [
	'ngRoute',
	'ngTouch',
  'ngSanitize',
  'mgcrea.ngStrap'
]).config(function($routeProvider, $locationProvider) {
	'use strict';


  //$locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');

	$routeProvider
	.when('/dashboard', {
		templateUrl: 'views/dashboard.html',
		controller: 'DashboardCtrl',
		reloadOnSearch: true
	})
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
		redirectTo: '/dashboard'
	});

});

app.run(function($rootScope){
	'use strict';

	var root = $rootScope.root = {};

	root.smallScreen = (screen.width <= 1024);

	root.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  root.findObjectsInArray = function (arr, obj, index) {
    var flag = false;
    var i;
    
    for ( i = 0; i < arr.length; i++) {
      if (arr[i].id === obj.id) {
        
        flag = true;
        break;

      }
    }

    if(index) {
      return i;
    } else {
      return flag;  
    }
  };

  root.findObjectById = function (questions, index) {
    var obj;

    angular.forEach(questions, function (question) {
      if (question.id === parseInt(index)) {
        
        obj = question;
        
      } 
    });

    return obj;
  };

  root.findNextId = function (questions, id) {
    var nextId = null;
    
    for (var i = 0; i < questions.length; i++) {
      if (questions[i].id === id) {
        nextId = questions[i+1].id;
        break;
      }
    }

    return nextId;
  };

  root.findPrevId = function (questions, id) {
    var nextId = null;
    
    for (var i = 0; i < questions.length; i++) {
      if (questions[i].id === id) {
        nextId = questions[i-1].id;
        break;
      }
    }

    return nextId;
  };

  root.markQuestion = function (question) {
    
    var tags = question.tags;
    var index = tags.indexOf('mark');
    
    if (index < 0) {
      
      tags.push('mark');

    } else {

      tags.splice(index, 1);

    }
    
  };
});
