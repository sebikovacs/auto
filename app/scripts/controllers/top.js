app.controller('TopCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data, taggedFilter) {
  'use strict';

  var top = $scope.top = {};
  var model = $scope.model = {};
  var storage = window.localStorage;
  model.user = data.model.user;

  data.GetUser().then(function () {
    // console.log(model.user);
  });

  top.shownSubmenu = '';

  $scope.Reset = function () {
    
    data.RemoveQuestions();
    $location.path($location.path());

  };

  top.ToggleSubmenu = function(submenu) {

    if(submenu === top.shownSubmenu) {
      
      top.shownSubmenu = '';
      return top.shownSubmenu;

    }

    top.shownSubmenu = submenu;

  };
  
});
