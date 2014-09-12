app.controller('QuizCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $interval, $q, data, taggedFilter) {
	'use strict';

  // private params
  var model = $scope.model = {};
  var storage = window.localStorage;
  var category = $routeParams.cat;
  var root = $rootScope.root;
  
  model.questions = data.model.questions;

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
  model.answers = { a: false, b: false, c: false };
  model.statistics = {};
  model.quizmode = ($location.path().indexOf('/quiz') === 0) ? true : false;
  
  model.quiz = [];
  model.current = 1;
  model.starred = false;

  model.timer = {
    minutes: 30,
    seconds: 0
  };

  // Private helper methods
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

  // Event methods
  $scope.StartQuiz = function () {
    var random, question, i, corectTag, incorectTag;

    // create a list of random questions for the quiz
    while (model.quiz.length <= quizLimits[category].max) {

      random = root.getRandomInt(0, model.questions[category].length);
      question = model.questions[category][random];

      if (!question.tags) {
        
        question.tags = [];
        model.quiz.push(question);

      } else {
        
        corectTag = question.tags.indexOf('corect');
        incorectTag = question.tags.indexOf('incorect');

        if ( corectTag < 0 && incorectTag < 0) {
          
          model.quiz.push(question);

        }

      }

    }

    model.question = model.quiz[0];

    startTimer();

  };

  // Init
  data.GetQuestions().then(function () {
    $scope.StartQuiz();
  });

  
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
    
    /* no need to check if corect/incorect tags are present
       since the questions are selected from a pristine pool
    */
    if (!model.valid) {

      model.question.tags.push('incorect');
      model.quizValid = false;
      
    } else {
      
      model.question.tags.push('corect');
      model.quizValid = true;
      
    }

    //$scope.$emit('$answersUpdate');

    $scope.NextQuestionInQuiz();

    data.SaveQuestions();
  };

  $scope.NextQuestionInQuiz = function () {

    if (model.quiz[model.current + 1]) {
      
      model.question = model.quiz[model.current + 1];

    } else {

      model.splash = true;

    }

    model.current = model.current + 1;

    data.SaveQuestions();

    $scope.ResetAnsweres();

    model.statistics.corect = taggedFilter(model.quiz, 'corect');
    model.statistics.incorect = taggedFilter(model.quiz, 'incorect');

    // Stop quiz if failed answers exceeds limit per category
    if (model.statistics.incorect.length > (quizLimits[category].max - quizLimits[category].min)) {
      model.splash = true;
    }

  };

  $scope.ResetAnsweres = function () {
    model.answers.a = false;
    model.answers.b = false;
    model.answers.c = false;
  };

  // $scope.StarQuestion = function () {
  //   var index = model.question.tags.indexOf('starred');

  //   model.starred = !model.starred;

  //   if (index < 0) {

  //     model.question.tags.push('starred');

  //   } else {

  //     model.question.tags.splice(index, 1);

  //   }

  //   $scope.StoreData();

  //   $scope.$emit('$answersUpdate');

  // };

  // $scope.StoreData = function () {
    
  //   storage.setItem('questions', JSON.stringify(model.questions));

  // };

});
