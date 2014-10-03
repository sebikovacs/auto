app.controller('ListQuestionsCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data, taggedFilter) {
  'use strict';

  var model = $scope.model = {};
  var storage = window.localStorage;
  var tags = [];
  
  model.category = $routeParams.cat;
  model.questions = data.model.questions;
  model.tags = [
    {
      name: 'Intrebari corecte',
      tag: 'corect',
      selected: false
    },
    {
      name: 'Intrebari gresite',
      tag: 'incorect',
      selected: false
    },
    {
      name: 'Intrebari salvate',
      tag: 'mark',
      selected: false
    }
  ];

  $scope.$watch('model.tags', function () {
    tags = [];

    angular.forEach(model.tags, function (tag) {
      if (tag.selected) {
        tags.push(tag.tag);
      }
    });

    if (tags.length > 0) {
      
      model.questionsList = taggedFilter(model.questions[model.category], tags);

    } else {

      model.questionsList = model.questions[model.category];
    }

  }, true);
  
  
  // Init
  data.GetQuestions().then(function () {
    
    model.questionsList = model.questions[model.category];

  });



});

