app.controller('AllQuestionsCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data) {
	'use strict';

  var model = $scope.model = {};
  var root = $scope.root;
  var current = 0;
  //var top = $scope.top;

  model.answers = {
    a: false,
    b: false,
    c: false
  };

  model.alert = false;

  data.GetQuestions({}).then(function (res) {
    model.questions = res;
    model.question = model.questions[current];

  }, function (err) {
    
  });

  $scope.SetAnswer = function (param) {
    model.alert = false;
    
    model.answers[param] = !model.answers[param];

  };

  $scope.ValidateAnswer = function () {
    var correctAnswers = model.question.v.split(' ');
    var setAnswers = [];
    angular.forEach(model.answers, function (value, key) {
      if (value) {
        setAnswers.push(key);
      }
    });
     
    model.valid = angular.equals(setAnswers.sort(), correctAnswers.sort());
    model.alert = true;

  };

  $scope.NextQuestion = function () {

    current = current + 1;
    model.question = model.questions[current];

    $scope.ResetAnsweres();
  };

  $scope.ResetAnsweres = function () {
    model.answers = {
      a: false,
      b: false,
      c: false
    };
  };

});
