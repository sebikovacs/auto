app.controller('TopCtrl', function($rootScope, $scope, $routeParams, $location, $timeout, $q, data, taggedFilter) {
  'use strict';

  var top = $scope.top = {};
  var storage = window.localStorage;

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
