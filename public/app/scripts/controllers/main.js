'use strict';

/* Controllers */

var Controllers  =  angular.module('myApp.controllers', []);
Controllers.controller('MyCtrl1', ['$scope','security', 'Publipostages', 'currentUser', 'SVG_AVATAR_F', 'SVG_AVATAR_M', "$location", function($scope, security, Publipostages, currentUser, SVG_AVATAR_F, SVG_AVATAR_M, $location) {
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
    
    $scope.goTo = function(location){
        $location.path(location);
    }
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

Controllers.controller('CreatePublipostage', ['$scope', 'security','Regroupements', '$location', function($scope, security, Regroupements, $location){
    // option tinyMce ;
    $scope.tinymceOptions = {
        language:"fr",
        menubar: false,
        theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
        font_size_style_values: "12px,13px,14px,16px,18px,20px",
        toolbar: "styleselect,fontsizeselect,sub,sup,|,bold,italic,underline,strikethrough,| alignleft,aligncenter,alignright | bullist,numlist"
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
    
    $scope.goTo = function(location){
        $location.path(location);
    }
    
    $scope.goToHistory=function(id){
        $location.path('/historique/'+id);    
    }
    
}]);


