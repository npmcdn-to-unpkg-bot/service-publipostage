'use strict';

/* Controllers */

angular.module('myApp.controllers', []).controller('MyCtrl1', ['$scope','security', function($scope, security) {
    $scope.tinymceOptions = {
        language:"fr"
    };
    
    //var user = security.requestCurrentUser().then(function(user) {
    //    console.log(user);
    //});
    $scope.showForm = false;
    //console.log(security.isAuthenticated());
    $scope.toggle = function(){
        $scope.showForm = !$scope.showForm;
    }
}]).controller('MyCtrl2', [function() {

}]).controller('wizardController', ['$scope', function($scope){
    $scope.log = function(event){
    console.log(event);
  }
  $scope.user = {};
  $scope.etablissements = [];
}]);  
