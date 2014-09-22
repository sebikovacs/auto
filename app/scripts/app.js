/* Adsavvy app
 */

var app = angular.module('autohack', [
	'ngRoute',
	'ngTouch'
]).config(function($routeProvider) {
	'use strict';

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

  root.findNextId = function (id) {
    var nextId = null;
    
    for (var i = 0; i < model.questions.all.length; i++) {
      if (model.questions.all[i].id === id) {
        nextId = model.questions.all[i+1].id;
        break;
      }
    }

    return nextId;
  };

  root.findPrevId = function (id) {
    var nextId = null;
    
    for (var i = 0; i < model.questions.all.length; i++) {
      if (model.questions.all[i].id === id) {
        nextId = model.questions.all[i-1].id;
        break;
      }
    }

    return nextId;
  };

});
