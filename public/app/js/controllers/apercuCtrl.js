'use strict';

angular.module( 'publipostageClientApp' )
  .controller( 'ApercuCtrl',
               [ '$scope', '$rootScope', '$state', '$sce', 'Menus',
                 function( $scope, $rootScope, $state, $sce, Menus ) {
                     // get the list of menus
                     $scope.menus = Menus;

                     $scope.toTrustedHtml = function ( html_code ) {
                         return $sce.trustAsHtml( html_code );
                     };

                     $scope.goBackToMessage = function ( location ) {
                         $state.go( 'message', { type: location } );
                     };
                 }
               ] );
