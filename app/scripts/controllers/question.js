app.controller('QuestionCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $interval, $q, data, taggedFilter) {
  'use strict';

  // private params
  var model = $scope.model = {};
  var storage = window.localStorage;
  var category = $routeParams.cat;
  var questionId = $routeParams.id;


  // public params
  model.quizmode = ($location.path().indexOf('/quiz') === 0) ? true : false;
  model.answers = { a: false, b: false, c: false };

  model.questionsForCat = [];

  model.current = 1;
  model.starred = false;

  $scope.StoreDatas = function () {
    
    storage.setItem('questions', JSON.stringify(model.questions));

  };


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

  var findObjectById = function (arr, id) {
    
    var obj;
    
    angular.forEach(arr, function (item) {
      
      if (item.id === parseInt(id, 10)) {
        obj = item;
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
    
    if (questions && !$.isEmptyObject(questions)) {
      
      
      model.questions = questions;
      model.questionsForCat.push.apply(model.questionsForCat, questions[category]);

      // find the question asked by the user
      model.question = findObjectById(model.questionsForCat, questionId);
      

      if (model.question.tags && model.question.tags.indexOf('seen') < 0) {
        
        model.question.tags.push('seen');
      

      } else if (!model.question.tags) {
        
        model.question.tags = ['seen'];
      
        
      }

      $scope.StoreDatas();
      

    } else {
      
      data.GetQuestions()
        .then(function (res) {
          
          model.questions = res;

          model.questionsForCat.push.apply(model.questionsForCat, res[category]);

          // find the question asked by the user
          model.question = findObjectById(model.questionsForCat, questionId);
          
          if (model.question.tags && model.question.tags.indexOf('seen') < 0) {
            
            model.question.tags.push('seen');

          } else {
            
            model.question.tags = ['seen'];

          }
          
          $scope.StoreDatas();


        }).catch(function (err) {
          
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

    $scope.StoreDatas();

    $scope.$emit('$answersUpdate');

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

    $scope.StoreDatas();
  };

  $scope.NextQuestion = function () {

    var nextId = findNextId(model.current);

    model.questions.current = nextId;

    $scope.StoreDatas();

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

    $scope.StoreDatas();

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

    $scope.StoreDatas();

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
