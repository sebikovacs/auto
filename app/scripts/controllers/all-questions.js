app.controller('AllQuestionsCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data) {
	'use strict';

  var model = $scope.model = {};
  var root = $scope.root;
  var storage = window.localStorage;
  //var top = $scope.top;

  model.answers = {
    a: false,
    b: false,
    c: false,
  };

  model.alert = false;
  
  model.questions = {
    correct: [],
    incorrect: [],
    starred: [],
    current: 0
  };


  model.initQuestionsModel = function () {
    
    if (storage.getItem('questions') && typeof JSON.parse(storage.getItem('questions')) === 'object') {
      model.questions = angular.extend(model.questions, JSON.parse(storage.getItem('questions')));
      model.question = model.questions.all[model.questions.current];

      console.log(model.questions);

    } else {

      data.GetQuestions({}).then(function (res) {
        
        model.questions.all = res;
        model.question = model.questions.all[model.questions.current];

        //Store questions to localStorage
        $scope.StoreData();

      }, function (err) {
        
      });    
    }

  };

  model.initQuestionsModel();

  $scope.StoreData = function () {
    
    storage.setItem('questions', JSON.stringify(model.questions));

  };

  $scope.SetAnswer = function (param) {
    
    model.alert = false;
    
    model.answers[param] = !model.answers[param];

  };

  var findObjectsInArray = function (arr, obj) {
    var flag = false;
    
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === obj.id) {
        
        flag = true;
        break;

      }
    }

    return flag;
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

    
    if (!model.valid) {
      
      if (!findObjectsInArray(model.questions.incorrect, model.question)) {
        model.questions.incorrect.push(model.question);
      }

    } else {
      
      if (!findObjectsInArray(model.questions.correct, model.question)) {
        model.questions.correct.push(model.question);
      }

      $timeout(function () {
        
        model.alert = false;
        
        $scope.NextQuestion();

      }, 3000);

    }

    $scope.StoreData();


  };

  $scope.NextQuestion = function () {

    model.questions.current = model.questions.current + 1;
    model.question = model.questions.all[model.questions.current];

    $scope.StoreData();

    $scope.ResetAnsweres();
  };

  $scope.PrevQuestion = function () {

    model.questions.current = model.questions.current - 1;
    model.question = model.questions.all[model.questions.current];

    $scope.StoreData();

    $scope.ResetAnsweres();
  };

  $scope.ResetAnsweres = function () {
    model.answers.a = false;
    model.answers.b = false;
    model.answers.c = false;
  };

});
