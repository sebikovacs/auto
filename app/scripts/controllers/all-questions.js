app.controller('AllQuestionsCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data) {
	'use strict';

  var model = $scope.model = {};
  var root = $scope.root;
  var storage = window.localStorage;
  var top = $scope.top;

  model.answers = {
    a: false,
    b: false,
    c: false,
  };

  model.alert = false;
  //model.questions.current = parseInt($routeParams.id, 10);
  
  model.questions = {
    correct: [],
    incorrect: [],
    starred: [],
    current: parseInt($routeParams.id, 10)
  };

  model.current = parseInt($routeParams.id, 10);

  model.starred = false;

  // Helper method
  var findObjectsInArray = function (arr, obj, index) {
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

  var findObjectById = function (index) {
    var obj;
    
    angular.forEach(model.questions.all, function (question) {
      if (question.id === index) {
        obj = question;
      } 
    });

    return obj;
  };

  var findNextId = function (id) {
    var nextId = null;
    
    for (var i = 0; i < model.questions.all.length; i++) {
      if (model.questions.all[i].id == id) {
        nextId = model.questions.all[i+1].id;
        break;
      }
    }

    return nextId;
  };

  var findPrevId = function (id) {
    var nextId = null;
    
    for (var i = 0; i < model.questions.all.length; i++) {
      if (model.questions.all[i].id == id) {
        nextId = model.questions.all[i-1].id;
        break;
      }
    }

    return nextId;
  };

  model.initQuestionsModel = function () {
    
    

    if (storage.getItem('questions') && typeof JSON.parse(storage.getItem('questions')) === 'object') {
      
      model.questions = angular.extend(model.questions, JSON.parse(storage.getItem('questions')));

      model.question = findObjectById(model.current);


    } else {

      data.GetQuestions({}).then(function (res) {
        
        model.questions.all = res;
        model.question = findObjectById(model.current);

        //Store questions to localStorage
        $scope.StoreData();

      }, function (err) {
        
      });    
    }

  };

  model.initQuestionsModel();

  $scope.StarQuestion = function () {

    model.starred = !model.starred;

    if (!findObjectsInArray(model.questions.starred, model.question)) {
      model.questions.starred.push(model.question);
    } else {
      model.questions.starred.splice(findObjectsInArray(model.questions.starred, model.question, true), 1);
    }

    $scope.StoreData();

  };

  $scope.StoreData = function () {
    
    storage.setItem('questions', JSON.stringify(model.questions));

  };

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
        $scope.$emit('$answersUpdate');

        model.starred = false;

      }, 3000);

    }

    $scope.StoreData();
  };

  $scope.NextQuestion = function () {

    var nextId = findNextId(model.current);

    model.questions.current = nextId;

    $scope.StoreData();

    $scope.ResetAnsweres();

    model.starred = false;

    $location.path('chestionar/'+ nextId);
    
  };

  $scope.PrevQuestion = function () {

    var prevId = findPrevId(model.current);

    model.questions.current = prevId;    

    $scope.StoreData();

    $scope.ResetAnsweres();

    model.starred = false;

    $location.path('chestionar/'+ prevId);
  };

  $scope.ResetAnsweres = function () {
    model.answers.a = false;
    model.answers.b = false;
    model.answers.c = false;
  };

});
