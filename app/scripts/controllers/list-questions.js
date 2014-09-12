app.controller('ListQuestionsCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data, taggedFilter) {
  'use strict';

  var model = $scope.model = {};
  var storage = window.localStorage;
  model.category = $routeParams.cat;

  model.taggedQuestions = [];
  model.questions = data.model.questions;
  
  // Init
  data.GetQuestions().then(function () {
    
    model.questionsList = model.questions[model.category];

  });
  
  

});

