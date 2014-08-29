app.controller('ListQuestionsCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data) {
  'use strict';

  var model = $scope.model = {};
  //var root = $scope.root;
  var storage = window.localStorage;

  console.log($routeParams);

  model.initQuestionsModel = function () {
    
    if (storage.getItem('questions') && typeof JSON.parse(storage.getItem('questions')) === 'object') {

      model.questions = JSON.parse(storage.getItem('questions'));

    } else {

      model.questions = null;
               
    }

  };

  model.initQuestionsModel();

  if (model.questions) {
    if ($routeParams.tag === 'corecte') {
      
      model.questionsList = model.questions.correct;
      model.listName = 'corecte';

    } else if ($routeParams.tag === 'incorecte') {

      model.questionsList = model.questions.incorrect;
      model.listName = 'incorecte';

    } else if ($routeParams.tag === 'marcate') {
      
      model.questionsList = model.questions.incorrect;
      model.listName = 'marcate';      

    } else if ($routeParams.tag === 'toate') {
      
      model.questionsList = model.questions.all;
      model.listName = 'toate';      

    }
  }

  // if (model.questions) {
  //   if ($location.path() === '/intrebari-raspuns-corect') {
      
  //     model.questionsList = model.questions.correct;
  //     model.listName = 'corect';

  //   } else if ($location.path() === '/intrebari-raspuns-gresit') {
      
  //     model.questionsList = model.questions.incorrect;
  //     model.listName = 'gresit';

  //   } else if ($location.path() === '/intrebari-marcate') {
      
  //     model.questionsList = model.questions.starred;
  //     model.listName = 'marcate';

  //   }
  // }
});

