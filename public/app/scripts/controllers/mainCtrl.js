'use strict';

/* Controllers */

var Controllers  =  angular.module('myApp.controllers', []);

/********************************* Main controller of the application *****************************************/
Controllers.controller('MainCtrl', ['$scope', '$sce', 'security','Regroupements', '$location', '$rootScope', 'MessageService','Redirect', 
    'colors', 'Menus','tinymceOptions', '$state', 
    function($scope, $sce, security, Regroupements, $location, $rootScope, MessageService, Redirect,
     colors, Menus, tinymceOptions, $state){
        // making Redirect utils accesible in the scope
        $scope.Redirect = Redirect;
        $scope.security = security;

        // editor tinyMce  options;
        $scope.tinymceOptions =  tinymceOptions;
        
        //initialize destinations
        //$scope.destinations = [];
        $scope.tinyMessage = MessageService.getMessage()['message'];
        console.log($scope.tinyMessage);

        security.requestCurrentUser().then(function(user) {
            //console.log(user);
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
        
        $scope.addToMessage = function(text){
            console.log('clicked');
            console.log($scope.tinyMessage);
            $scope.tinyMessage = $scope.tinyMessage + text; 
        }
        
        $scope.goToPreview = function(location){
            MessageService.addMessage($scope.tinyMessage, $scope.title)
            console.log(MessageService.getMessage());
            $location.path('/apercu/'+location);
        }
        
        $scope.addType = function(){
            MessageService.addType('test');
        }
        
        // load message from the root ..
        $scope.tinyMessage = MessageService.getMessage()['message'];

        $scope.square = {icone: $rootScope.racine_images + '00_vide.svg'};
        
}]);
