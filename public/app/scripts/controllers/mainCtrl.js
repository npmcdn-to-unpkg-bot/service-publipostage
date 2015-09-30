'use strict';

/* Controllers */

var Controllers  =  angular.module('myApp.controllers', []);

/********************************* Main controller of the application *****************************************/
Controllers.controller('MainCtrl', ['$scope', '$sce', 'security','Regroupements', '$location', '$rootScope', 'MessageService','Redirect', 
    'colors', 'Menus', '$state', 
    function($scope, $sce, security, Regroupements, $location, $rootScope, MessageService, Redirect,
     colors, Menus, $state){
        // making Redirect utils accesible in the scope
        $scope.Redirect = Redirect;
        $scope.security = security;

        security.requestCurrentUser().then(function(user) {
            console.log(security.currentUser);
            $scope.currentUser = user;
            console.log(user.info['uid']);
            Regroupements.get({id:user.info['uid']}, function(regroupements){
                console.log(regroupements);
                $scope.regroupements = regroupements;
            });
        });

        // get the list of menus
        $scope.menus = Menus;
                
        $scope.goToPreview = function(location){
            MessageService.addMessage($scope.htmlMessage, $scope.title)
            $location.path('/apercu/'+location);
        }
        
        $scope.addType = function(){
            MessageService.addType('test');
        }
        
        $scope.square = {icone: $rootScope.racine_images + '00_vide.svg'};
        
}]);
