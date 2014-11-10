app.controller('QuestionCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $interval, $q, data, taggedFilter) {
  'use strict';

  // private params
  var model = $scope.model = {};
  var storage = window.localStorage;
  var category = $routeParams.cat;
  var questionId = $routeParams.id;
  var root = $rootScope.root;
  
  // public params
  model.quizmode = ($location.path().indexOf('/quiz') === 0) ? true : false;
  model.answers = { a: false, b: false, c: false };

  model.questionsForCat = [];

  model.starred = false;
  model.splash = false;  
  model.questions = data.model.questions;
  model.id = parseInt($routeParams.id, 10);


  // disqus
  model.disqus = {
    url: $location.absUrl(),
    id: model.id
  };

  // Init
  data.GetQuestions().then(function () {
    
    // find question by id in category
    model.question = root.findObjectById(model.questions[category], model.id);

    // Add a seen tag to the question
    if (model.question.tags.indexOf('seen') < 0) {

      model.question.tags.push('seen');

    }
    
  });

  $scope.SetAnswer = function (param) {
    
    model.alert = false;
    
    model.answers[param] = !model.answers[param];

  };

  var removeStringsFromArray = function (arr, string) {
    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === string) {
        arr.splice(i, 1);
      }
    }
  };

  $scope.ValidateAnswer = function () {
    
    var correctAnswers = model.question.v.split(' '),
        index = 0, corect, incorect, seen;
    
    model.valid = '';
    model.question.userAnswer = [];
        
    // add users set answers to an array to be compared with the valid ones
    angular.forEach(model.answers, function (value, key) {
      if (value) {

        model.question.userAnswer.push(key);

      }
    });

    if (model.question.userAnswer.length === 0) {
      
      model.alert = true;

    } else {

      model.valid = angular.equals(model.question.userAnswer, correctAnswers.sort());
      
      // Clean up tags of correct and incorect;
      removeStringsFromArray(model.question.tags, 'corect');
      removeStringsFromArray(model.question.tags, 'incorect');
      
      if (!model.valid) {

        model.question.tags.push('incorect');

        
      } else {
        
        model.question.tags.push('corect');

        $timeout(function () {
          $scope.NextQuestion();
        }, 1000);
        
      }

      if (!model.quizmode) {
        
        model.alert = true;

      }

      if (!model.valid) {
        $timeout(function () {

          model.alert = false;

        }, 2500);
      }

      data.SaveQuestions();

    }

  };

  $scope.NextQuestion = function () {
    
    // Reset answers
    $scope.ResetAnsweres();
    $location.path('/intrebare').search({
      cat: category,
      id: model.id + 1
    });

  };

  $scope.PrevQuestion = function () {

    // Reset answers
    $scope.ResetAnsweres();
    $location.path('/intrebare').search({
      cat: category,
      id: model.id - 1
    });
  };

  $scope.ResetAnsweres = function () {
    model.answers.a = false;
    model.answers.b = false;
    model.answers.c = false;
  };

  $scope.HideAlert = function () {
    
    model.alert = false;

    $scope.ResetAnsweres();

  };

  $scope.ShowRightAnswers = function () {

    $scope.HideAlert();

    var rightAnswers = model.question.v.split(' ');

    angular.forEach(rightAnswers, function (answer) {

      model.answers[answer] = !model.answers[answer];

    });
    
  };

  $scope.MarkQuestion = function () {
    
    root.markQuestion(model.question);
    
  };

  $scope.popover = {
    title: 'Salveaza intrebarea',
    content: 'In meniul din stanga, click pe "Categoria ' + category.toUpperCase()+ ' -> Toate intrebarile"'
  };

});
