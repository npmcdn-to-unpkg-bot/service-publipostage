'use strict';

/* Controllers */

angular.module('myApp.controllers', []).controller('MyCtrl1', ['$scope','security', 'Publipostages', function($scope, security, Publipostages) {
    $scope.tinymceOptions = {
        language:"fr"
    };
    //var user = security.requestCurrentUser().then(function(user) {
    //    console.log(user);
    //});
    Publipostages.all({}, function(publis){
        $scope.publis = publis
    })
    
}]).controller('MyCtrl2', [function() {

}]).controller('wizardController', ['$scope', function($scope){
    $scope.log = function(event){
    console.log(event);
  }
  $scope.user = {};
  $scope.etablissements = [];
}]);  
