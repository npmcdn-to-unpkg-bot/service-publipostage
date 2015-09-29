'use strict';

/********************************* Home page controller  *****************************************/
Controllers.controller('HomeCtrl', ['$scope','security', 'Publipostages', 'currentUser', 'SVG_AVATAR_F', 'SVG_AVATAR_M', "$location", "$rootScope", "$stateParams", "MessageService", 'Redirect','Squares',
    function($scope, security, Publipostages, currentUser, SVG_AVATAR_F, SVG_AVATAR_M, $location, $rootScope,  $stateParams, MessageService, Redirect, Squares) {
        $scope.Redirect = Redirect;   

        $scope.security = security;

        Publipostages.get({}, function(publis){
            $scope.publis = publis.data
        });
        
        $scope.addMessageType = function(type){
            MessageService.addMessageType(type);
        }

        $scope.squares = Squares;
        
        security.requestCurrentUser().then(function(user) {
            $scope.currentUser = user;
            $scope.color = "#EB5454";
            if (user.info['LaclasseSexe']=="M") {
                $scope.avatar = SVG_AVATAR_M
            } else if (user.info['LaclasseSexe']=="F") {
                $scope.avatar = SVG_AVATAR_F;
            }
            else{
                $scope.avatar = "";
            }
        });
}]);
