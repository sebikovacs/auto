app.controller('LegisCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data) {
  'use strict';

  var model = $scope.model = {};
  //var root = $scope.root;
  var storage = window.localStorage;

  data.GetLegis({}).then(function (res) {
        
    console.log(res);
    model.legis = res;

  }, function (err) {

    console.log(err);
    
  });
});
