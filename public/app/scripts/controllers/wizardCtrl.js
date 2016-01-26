'use strict';

angular.module( 'myApp' )
    .controller('wizardController', ['$scope', function($scope){
        $scope.log = function(event){
            console.log(event);
        }
        $scope.user = {};
        $scope.etablissements = [];
    }]);
