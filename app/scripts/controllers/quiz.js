app.controller('QuizCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $interval, $q, data, taggedFilter) {
	'use strict';

  // private params
  var model = $scope.model = {};
  var storage = window.localStorage;
  var ga = window.ga;
  
  var root = $rootScope.root;
  var moment = window.moment;

  model.questions = data.model.questions;
  model.user = data.model.user;
  model.category = $routeParams.cat;
  
  if (!model.category) {
    $location.path('/dashboard');
  }

  data.GetUser().then(function () {
    
  });

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
  model.statistics = {
    total: quizLimits[model.category].max,
    left: quizLimits[model.category].max - 1
  };
  model.quizmode = ($location.path().indexOf('/quiz') === 0) ? true : false;
  
  model.quiz = [];
  model.current = 0;
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
    var random, question, i = 1, corectTag, incorectTag;

    // create a list of random questions for the quiz
    while (model.quiz.length <= (quizLimits[model.category].max - 1)) {

      random = root.getRandomInt(0, (model.questions[model.category].length - 1));
      random = parseInt(random, 10);
      question = model.questions[model.category][random];

      corectTag = question.tags.indexOf('corect');
      incorectTag = question.tags.indexOf('incorect');

      if ( corectTag < 0 && incorectTag < 0) {
        
        question.tempId = i;

        model.quiz.push(question);

        i = i + 1;

      }

    }
    
    model.question = model.quiz[0];

    startTimer();

  };

  // Init
  data.GetQuestions().then(function () {
    
    if (model.category) {
      $scope.StartQuiz();  
    }
    
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

    // google analytics

    var ev = {
      'hitType': 'event',          // Required.
      'eventCategory': 'Quiz',   // Required.
      'eventAction': 'click',      // Required.
      'eventLabel': 'validate answer',
      'eventValue': question.id
    };
    ga('send', ev);

    $scope.NextQuestionInQuiz();

    data.SaveQuestions();
  };


  $scope.NextQuestionInQuiz = function () {
    

    // find current question in stack
    var index = 0;

    angular.forEach(model.quiz, function (question, i) {
      
      if (question.id === model.question.id) {
        
        index = i;
        
      }

    });

    if (index + 1 < model.quiz.length) {
      // find next unanswered question starting from the current question
      for (var i = index+1; i < model.quiz.length; i++) {

        if (model.quiz[i].tags.indexOf('corect') < 0 && model.quiz[i].tags.indexOf('incorect') < 0) {

          model.question = model.quiz[i];
          break;

        }

      }
    } else {

      // finish quiz
      model.splash = true;

    }

    data.SaveQuestions();

    $scope.ResetAnsweres();

    // Calculate number of questions left in quiz by eliminating answered questions
    model.statistics.corect = taggedFilter(model.quiz, 'corect');
    model.statistics.incorect = taggedFilter(model.quiz, 'incorect');
    model.statistics.left = model.statistics.total - (model.statistics.corect.length + model.statistics.incorect.length);

    // Stop quiz if failed answers exceeds limit per model.category
    if (model.statistics.incorect.length > (quizLimits[model.category].max - quizLimits[model.category].min)) {
      model.splash = true;
    }

  };

  $scope.ResetAnsweres = function () {
    model.answers.a = false;
    model.answers.b = false;
    model.answers.c = false;
  };

  $scope.AnswerLater = function () {

    var index = 0;

    angular.forEach(model.quiz, function (question, i) {
      if (question.id === model.question.id) {
        index = i;
      }
    });

    $scope.ResetAnsweres();

    // find next unanswered question
    for (var i = index+1; i < model.quiz.length; i++) {
      
      if (model.quiz[i].tags.length === 0) {
        model.question = model.quiz[i];
        break;
      }

    }

    var stashedQuestion = model.quiz.splice(index, 1);
    model.quiz.push(stashedQuestion[0]);
    
    
  };

  $scope.MarkQuestion = function () {
    
    root.markQuestion(model.question);
    
  };

  $scope.popover = {
    title: 'Salveaza intrebarea',
    content: 'In meniul din stanga, click pe "Categoria ' + model.category.toUpperCase()+ ' -> Toate intrebarile"'
  };

});
