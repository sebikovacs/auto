app.controller('QuizCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $interval, $q, data, taggedFilter) {
	'use strict';

  var model = $scope.model = {};
  //var root = $scope.root;
  var storage = window.localStorage;
  //var top = $scope.top;

  var d = new Date().getTime();
  var f = new Date(d + 30 * 60 * 1000);

  var interval = $interval(function () {
    d = new Date().getTime();
    var secondsLeft = moment(f-d).seconds();
    var minutesLeft = moment(f-d).minutes();

    model.timer = {
      minutes: minutesLeft,
      seconds: secondsLeft
    };
  }, 1000);

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

  model.answers = {
    a: false,
    b: false,
    c: false,
  };

  model.alert = false;
  model.quiz = [];

  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  model.questions = [];
  model.questionsForCat = [];

  model.current = 1;
  model.starred = false;


  $scope.StartQuiz = function () {
    
    // create a list of questions for the quiz
    for (var i = quizLimits[category].max; i > 0; i--) {
      model.quiz.push(model.questionsForCat[getRandomInt(0, model.questionsForCat.length)]);
    }

    model.question = model.quiz[0];

  };

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

  model.initQuestionsModel();

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

      model.timeout = $timeout(function () {
        
        model.alert = false;
        model.starred = false;
        
        $scope.NextQuestionInQuiz();
        $scope.$emit('$answersUpdate');

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

  model.statistics = {

  };

  $scope.NextQuestionInQuiz = function () {

    

    if (model.quiz[model.current + 1]) {
      model.question = model.quiz[model.current + 1];  
    } else {
      model.splash = true;
    }

    model.current = model.current + 1;

    $timeout.cancel(model.timeout);

    $scope.StoreData();

    $scope.ResetAnsweres();

    model.starred = false;
    model.alert = false;

    model.statistics.corect = taggedFilter(model.quiz, 'corect');
    model.statistics.incorect = taggedFilter(model.quiz, 'incorect');
    
    // Stop quiz if failed answers exceeds limit per category
    if (model.statistics.incorect.length > (quizLimits[category].max - quizLimits[category].min)) {
      model.splash = true;
    }


    // Stop quiz if user has reached last question




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
