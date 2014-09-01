app.controller('TopCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data, taggedFilter) {
  'use strict';

  var top = $scope.top = {};
  var storage = window.localStorage;

  top.model = {
    questions: {},
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

        console.log(top.model.questions);
        
        //Store questions to localStorage
        $scope.StoreData();

      }, function (err) {
        
      });    
    }
    
    top.model.correct   = taggedFilter(top.model.questions.all, 'corect').length;
    top.model.incorrect = taggedFilter(top.model.questions.all, 'incorect').length;
    top.model.starred   = taggedFilter(top.model.questions.all, 'starred').length;

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
    
    if($.inArray(tag, $scope.tags) === -1) {
      $scope.tags.push(tag);
    }

  });

  $scope.SetLabel = function (label) {
  
    var prevTags = $location.search();
    var index = 0;

    label = label.replace(/ /g,'_');

    if (prevTags.tags) {

      // check if selected
      if (prevTags.tags.indexOf(label) < 0) {

        label = prevTags.tags + '+' + label;

      } else {

        // find position in array and remove label
        var arr = prevTags.tags.split('+');

        index = arr.indexOf(label);
        arr.splice(index, 1);
        label = arr.join('+');
        
      }

    }

    top.model.label = label;

    $location.path('/intrebari').search({
      tags: label
    });
    
  };
  
});
