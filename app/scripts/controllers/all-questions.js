app.controller('AllQuestionsCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data) {
	'use strict';

  var model = $scope.model = {};
  var root = $scope.root;
  
  //var top = $scope.top;

  model.answers = {
    a: false,
    b: false,
    c: false,
  };

  model.alert = false;
  model.current = 0;

  data.GetQuestions({}).then(function (res) {
    model.questions = res;
    model.question = model.questions[model.current];

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

    
    $timeout(function () {
      
      model.alert = false;
      
      $scope.NextQuestion();

    }, 3000);
    
  };

  $scope.NextQuestion = function () {

    model.current = model.current + 1;
    model.question = model.questions[model.current];

    $scope.ResetAnsweres();
  };

  $scope.ResetAnsweres = function () {
    model.answers.a = false;
    model.answers.b = false;
    model.answers.c = false;
  };

});
