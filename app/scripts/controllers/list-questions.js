app.controller('ListQuestionsCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data, taggedFilter) {
  'use strict';

  var model = $scope.model = {};
  var storage = window.localStorage;
  model.category = $routeParams.cat;

  model.taggedQuestions = [];
  model.questionsForCat = [];
  model.questions = [];
 
  model.initQuestionsModel = function () {
    
    model.questions = JSON.parse(storage.getItem('questions'));

    if ( model.questions && !$.isEmptyObject(model.questions)) {
      

      model.questions = JSON.parse(storage.getItem('questions'));
      model.questionsForCat.push.apply(model.questionsForCat, model.questions[model.category]);

      $scope.StoreData();

    } else {
      
      data.GetQuestions()
        .then(function (res) {
          
          model.questions = res;
          model.questionsForCat.push.apply(model.questionsForCat, res[model.category]);
           
          $scope.StoreData();


        }).catch(function (err) {
          
          console.log(err);

        });
    }

  };

  $scope.StoreData = function () {
    
    storage.setItem('questions', JSON.stringify(model.questions));

  };

  
  model.initQuestionsModel();

  // if ($location.search().tags) {

  //   var taggedQuestions = taggedFilter(model.questions.all, $location.search().tags);

  //   model.taggedQuestions.push.apply(model.taggedQuestions, taggedQuestions);

  // } else {

  //   model.taggedQuestions = model.questions.all;

  // }

});

