app.controller('TopCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data) {
  'use strict';

  var top = $scope.top = {};
  var storage = window.localStorage;

  top.model = {
    questions: {}
  };

  

  var initQuestionsModel = function () {
    
    if (storage.getItem('questions') && typeof JSON.parse(storage.getItem('questions')) === 'object') {

      top.model.questions = angular.extend(top.model.questions, JSON.parse(storage.getItem('questions')));
      

    } else {

      data.GetQuestions({}).then(function (res) {
        
        model.questions.all = res;
        
        //Store questions to localStorage
        $scope.StoreData();

      }, function (err) {
        
      });    
    }

  };

  $scope.$on('$answersUpdate', function () {
    initQuestionsModel();
  });

  initQuestionsModel();
  
});
