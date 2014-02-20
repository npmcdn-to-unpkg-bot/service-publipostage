'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', ['$scope', function($scope) {
    $scope.tinymceOptions = {
        language:"fr"
    };
  }])
  .controller('MyCtrl2', [function() {

  }]);  
