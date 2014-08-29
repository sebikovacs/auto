app.controller('TopCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data) {
  'use strict';

  var top = $scope.top = {};
  var storage = window.localStorage;

  top.model = {
    questions: {}
  };

  $scope.StoreData = function () {
    
    storage.setItem('questions', JSON.stringify(top.model.questions));

  };

  var initQuestionsModel = function () {
    
    if (storage.getItem('questions') && typeof JSON.parse(storage.getItem('questions')) === 'object') {

      top.model.questions = angular.extend(top.model.questions, JSON.parse(storage.getItem('questions')));
      

    } else {

      data.GetQuestions({}).then(function (res) {
        
        top.model.questions.all = res;
        
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

  // extract an array of tags
  var alltags = [];
  $scope.tags = [];

  angular.forEach(top.model.questions.all, function (question) {

    alltags.push.apply(alltags, question.tags);

  });

  angular.forEach(alltags, function (tag) {
    
    if($.inArray(tag, $scope.tags) === -1) $scope.tags.push(tag);

  });

  $scope.SetLabel = function (label) {
  
    var prevTags = $location.search();

    label = label.replace(/ /g,"_");

    if (prevTags.tags) {
      label = prevTags.tags + '+' + label;
    }

    $location.search({
      tags: label
    });
    
  };

  // Tagging

  // aici preluam clickurile pe label
  // formatam url-ul cu mai multe labeluri daca se poate
  // trimitem mai departe cu location
  // adaugam un selected la label-ul selectat

  // in tagcontroller
  // descalcim url-ul
  // filtram intrebarile in functie de taguri
  
});
