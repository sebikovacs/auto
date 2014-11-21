app.controller('QuizReviewCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data, taggedFilter) {
  'use strict';

  var model = $scope.model = {};
  var timestamp = parseInt($routeParams.timestamp, 10);

  var getQuiz = function (timestamp) {
    var q;
    
    angular.forEach(model.user.quizes, function (quiz) {

      if (quiz.time === timestamp){
        q = quiz;
      }

    });

    return q;
  };

  data.GetUser().then(function (res) {
    model.user = res;
    model.quiz = getQuiz(timestamp);
    model.questions = model.quiz.questions;
    model.question = model.questions[0];
    model.m `
  });

  $scope.Go = function (direction) {

    model.question = model.questions[];
  };

});
