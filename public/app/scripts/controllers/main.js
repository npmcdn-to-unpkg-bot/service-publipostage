'use strict';

/* Controllers */

var Controllers  =  angular.module('myApp.controllers', []);
Controllers.controller('MyCtrl1', ['$scope','security', 'Publipostages', 'currentUser', 'SVG_AVATAR_F', 'SVG_AVATAR_M', function($scope, security, Publipostages, currentUser, SVG_AVATAR_F, SVG_AVATAR_M) {
    $scope.tinymceOptions = {
        language:"fr"
    };
    //var user = security.requestCurrentUser().then(function(user) {
    //    console.log(user);
    //});
    Publipostages.all({}, function(publis){
        $scope.publis = publis
    });
    
    security.requestCurrentUser().then(function(user) {
      //console.log(user);
      $scope.currentUser = user;
      $scope.color = "#EB5454";
      if (user.info['LaclasseSexe']=="M") {
        $scope.avatar = SVG_AVATAR_M
      } else if (user.info['LaclasseSexe']=="F") {
        $scope.avatar = SVG-AVATAR_F;
      }
      else{
        $scope.avatar = "";
      }
      
    });
}]);

Controllers.controller('MyCtrl2', [function() {

}]);

Controllers.controller('wizardController', ['$scope', function($scope){
    $scope.log = function(event){
        console.log(event);
    }
    $scope.user = {};
    $scope.etablissements = [];
}]);

Controllers.controller('CreatePublipostage', ['$scope', 'security','Regroupements', function($scope, security, Regroupements){
    // option tinyMce ;
    $scope.tinymceOptions = {
        language:"fr"
    };
    
    $scope.title = "title";
    $scope.tinymceModel = "Message";
    
    security.requestCurrentUser().then(function(user) {
        //console.log(user);
        $scope.currentUser = user;
        console.log(user.info['uid']);
        Regroupements.get({id:user.info['uid']}, function(regroupements){
            console.log(regroupements);
            $scope.regroupements = regroupements
        });
    });
    
}]);


