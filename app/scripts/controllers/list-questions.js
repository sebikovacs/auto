app.controller('ListQuestionsCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data, taggedFilter) {
  'use strict';

  var model = $scope.model = {};
  var storage = window.localStorage;

  model.taggedQuestions = [];
 
  model.initQuestionsModel = function () {
    
    if (storage.getItem('questions') && typeof JSON.parse(storage.getItem('questions')) === 'object') {

      model.questions = JSON.parse(storage.getItem('questions'));

    } else {

      model.questions = null;
               
    }

  };

  
  model.initQuestionsModel();

  
  if (model.questions) {
    console.log(model.questions);
    if ($routeParams.tag === 'corecte') {
      
      model.questionsList = model.questions.correct;
      model.listName = 'corecte';

    } else if ($routeParams.tag === 'incorecte') {

      model.questionsList = model.questions.incorrect;
      model.listName = 'incorecte';

    } else if ($routeParams.tag === 'marcate') {
      
      model.questionsList = model.questions.marked;
      model.listName = 'marcate';      

    } else if ($routeParams.tag === 'toate') {
      
      model.questionsList = model.questions.all;
      model.listName = 'toate';      

    }
  }
  
  if ($location.search().tags) {

    var taggedQuestions = taggedFilter(model.questions.all, $location.search().tags);

    model.taggedQuestions.push.apply(model.taggedQuestions, taggedQuestions);

  }

});

