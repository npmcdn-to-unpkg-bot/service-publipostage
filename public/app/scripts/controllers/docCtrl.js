'use strict';

angular.module( 'myApp' )
    .controller('DocCtrl', ['$scope', '$state', function($scope, $state){

        $scope.pdfUrl = 'api/publipostage/'+$state.params['id']+'/pdf';
    }]);
