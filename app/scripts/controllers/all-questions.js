app.controller('AllQuestionsCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data) {
	'use strict';

  var model = $scope.model = {};
  //var root = $scope.root;
  var storage = window.localStorage;
  //var top = $scope.top;

  model.answers = {
    a: false,
    b: false,
    c: false,
  };

  model.alert = false;
  //model.questions.current = parseInt($routeParams.id, 10);
  
  model.questions = {
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
      if (model.questions.all[i].id === id) {
        nextId = model.questions.all[i+1].id;
        break;
      }
    }

    return nextId;
  };

  var findPrevId = function (id) {
    var nextId = null;
    
    for (var i = 0; i < model.questions.all.length; i++) {
      if (model.questions.all[i].id === id) {
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

      // Set star if starred
      if (model.question.tags.indexOf('starred') >= 0) {
        model.starred = true;
      }


    } else {

      data.GetQuestions({}).then(function (res) {
        
        model.questions.all = res;
        model.question = findObjectById(model.current);

        // Set star if starred
        if (model.question.tags.indexOf('starred') >= 0) {
          model.starred = true;
        }

        // Store questions to localStorage
        $scope.StoreData();

      }, function (err) {

        console.log(err);
        
      });    
    }

    

  };

  model.initQuestionsModel();

  $scope.StarQuestion = function () {
    var index = model.question.tags.indexOf('starred');

    model.starred = !model.starred;

    if (index < 0) {

      model.question.tags.push('starred');

    } else {

      model.question.tags.splice(index, 1);

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
    var index = 0;

    // set tag array if not found
    if (!model.question.tags) {
      model.question.tags = [];
    }
    
    angular.forEach(model.answers, function (value, key) {
      if (value) {
        setAnswers.push(key);
      }
    });
     
    if (angular.equals(setAnswers.sort(), correctAnswers.sort())) {
      
      model.valid = true;
      model.invalid = false;

    } else {

      model.valid = false;
      model.invalid = true;

    }
    
    model.alert = true;

    
    if (!model.valid) {

      // index = model.question.tags.indexOf('corect');
      
      // //remove previously set correct answer
      // if (index >= 0) {
      //   model.question.tags.splice(index, 1);
      // }

      if (model.question.tags.indexOf('incorect') < 0) {
        model.question.tags.push('incorect');
      }
      

    } else {
      
      // index = model.question.tags.indexOf('incorect');
      
      // //remove previously set correct answer
      // if (index >= 0) {
      //   model.question.tags.splice(index, 1);
      // }
      
      if (model.question.tags.indexOf('corect') < 0) {
        model.question.tags.push('corect');
      }

      $timeout(function () {
        
        model.alert = false;
        model.starred = false;
        
        $scope.NextQuestion();
        $scope.$emit('$answersUpdate');

      }, 3000);

    }

    console.log(model.question);

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

  $scope.HideAlert = function () {
    
    model.alert = false;

    $scope.ResetAnsweres();

  };

  $scope.ShowRightAnswers = function () {

    $scope.HideAlert();

    var rightAnswers = model.question.v.split('');

    angular.forEach(rightAnswers, function (answer) {

      model.answers[answer] = !model.answers[answer];

    });
    
  };

});
