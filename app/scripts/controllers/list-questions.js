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

  if ($location.search().tags) {

    var taggedQuestions = taggedFilter(model.questions.all, $location.search().tags);

    model.taggedQuestions.push.apply(model.taggedQuestions, taggedQuestions);

  } else {

    model.taggedQuestions = model.questions.all;

  }

});

