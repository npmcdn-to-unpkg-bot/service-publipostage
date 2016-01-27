'use strict';

angular.module( 'myApp' )
  .controller( 'ApercuCtrl',
               [ '$scope', '$location', '$rootScope', '$state', '$sce', 'Menus', 'MessageService',
                 function( $scope, $location, $rootScope, $state, $sce, Menus, MessageService ) {
                     // get the list of menus
                     $scope.menus = Menus;

                     $scope.toTrustedHtml = function ( html_code ) {
                         return $sce.trustAsHtml( html_code );
                     };

                     $scope.goBackToMessage = function ( location ) {
                         $location.path( '/message/' + location );
                     };
                 }
               ] );
