app.controller('TopCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data, taggedFilter) {
  'use strict';

  var top = $scope.top = {};
  var storage = window.localStorage;

  $scope.Reset = function () {
    
    data.RemoveQuestions();
    $location.path($location.path());

  }
  
});
