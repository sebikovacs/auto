app.controller('QuizCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $interval, $q, data, taggedFilter) {
	'use strict';

  // private params
  var model = $scope.model = {};
  var storage = window.localStorage;
  var category = $routeParams.cat;

  var quizLimits = {
    a: {
      min: 17,
      max: 20
    },
    b: {
      min: 22,
      max: 26
    },
    c: {
      min: 9,
      max: 11
    },
    d: {
      min: 22,
      max: 26
    }
  };

  // public params
  model.quizmode = ($location.path().indexOf('/quiz') === 0) ? true : false;
  model.answers = { a: false, b: false, c: false };
  model.statistics = {};
  
  model.quiz = [];
  model.questions = [];
  model.questionsForCat = [];

  model.current = 1;
  model.starred = false;


  // Private helper methods
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var startTimer = function () {
    var d = new Date().getTime();
    var f = new Date(d + 30 * 60 * 1000);

    var interval = $interval(function () {
      
      d = new Date().getTime();
      
      var secondsLeft = moment(f-d).seconds();
      var minutesLeft = moment(f-d).minutes();

      if (minutesLeft === 0 && secondsLeft === 0) {

        model.splash = true;
        
        $interval.cancel(interval);
        interval = undefined;

      }

      model.timer = {
        minutes: minutesLeft,
        seconds: secondsLeft
      };
    }, 1000);
  };

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

  // Init
  model.initQuestionsModel = function () {

    var questions = JSON.parse(storage.getItem('questions'));
    
    if (questions) {
      
      model.questions = questions;
      model.questionsForCat.push.apply(model.questionsForCat, model.questions[category]);

      $scope.StartQuiz();

    } else {

      data.GetQuestions()
        .then(function (res) {
          
          model.questions = res;
          model.questionsForCat.push.apply(model.questionsForCat, model.questions[category]);

          $scope.StartQuiz();

          $scope.StoreData();


        }).catch(function (err) {
          
          console.log(err);

        });
    }
  };

  // Event methods
  $scope.StartQuiz = function () {
    var random, question, i, seenTag, corectTag, incorectTag;

    // create a list of random questions for the quiz
    while (model.quiz.length <= quizLimits[category].max) {

      random = getRandomInt(0, model.questionsForCat.length);
      question = model.questionsForCat[random];

      if (!question.tags) {
        
        question.tags = [];
        model.quiz.push(question);

      } else {
        
        seenTag = question.tags.indexOf('seen');
        corectTag = question.tags.indexOf('corect');
        incorectTag = question.tags.indexOf('incorect');

        if (seenTag < 0 && ( corectTag < 0 || incorectTag < 0)) {
          
          model.quiz.push(question);

        }

      }

    }

    model.question = model.quiz[0];

    startTimer();

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

    $scope.$emit('$answersUpdate');

  };

  $scope.StoreData = function () {
    
    storage.setItem('questions', JSON.stringify(model.questions));

  };

  $scope.SetAnswer = function (param) {
    
    model.alert = false;
    
    model.answers[param] = !model.answers[param];

  };

  $scope.ValidateAnswer = function () {
    
    var correctAnswers = model.question.v.split(' '),
        setAnswers = [], index = 0, corect, incorect, seen;
        
    // add users set answers to an array to be compared with the valid ones
    angular.forEach(model.answers, function (value, key) {
      if (value) {
        setAnswers.push(key);
      }
    });
    
    model.valid = angular.equals(setAnswers.sort(), correctAnswers.sort());
    
    if (!model.quizmode) {

      model.splash = true;  

    }
    
    if (!model.valid) {

      model.question.tags.push('incorect');
      
    } else {
      
      model.question.tags.push('corect');
      
    }

    $scope.$emit('$answersUpdate');

    $scope.NextQuestionInQuiz();

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

 

  $scope.NextQuestionInQuiz = function () {

    if (model.quiz[model.current + 1]) {
      
      model.question = model.quiz[model.current + 1];

    } else {

      model.splash = true;

    }

    model.current = model.current + 1;

    $scope.StoreData();

    $scope.ResetAnsweres();

    model.statistics.corect = taggedFilter(model.quiz, 'corect');
    model.statistics.incorect = taggedFilter(model.quiz, 'incorect');

    // Stop quiz if failed answers exceeds limit per category
    if (model.statistics.incorect.length > (quizLimits[category].max - quizLimits[category].min)) {
      model.splash = true;
    }

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
