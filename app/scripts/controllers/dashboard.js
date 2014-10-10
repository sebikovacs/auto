app.controller('DashboardCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data, taggedFilter) {
  'use strict';

  var model = $scope.model = {};
  
  model.questions = data.model.questions;

  data.GetQuestions().then(function (res) {

    model.a = {
      corect: taggedFilter(model.questions.a, 'corect').length,
      incorect: taggedFilter(model.questions.a, 'incorect').length,
      total: model.questions.a.length
    };

    model.b = {
      corect: taggedFilter(model.questions.b, 'corect').length,
      incorect: taggedFilter(model.questions.b, 'incorect').length,
      total: model.questions.b.length
    };

    model.c = {
      corect: taggedFilter(model.questions.c, 'corect').length,
      incorect: taggedFilter(model.questions.c, 'incorect').length,
      total: model.questions.c.length
    };

    model.d = {
      corect: taggedFilter(model.questions.d, 'corect').length,
      incorect: taggedFilter(model.questions.d, 'incorect').length,
      total: model.questions.d.length
    };

    

  });

});
