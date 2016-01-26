'use strict';

angular.module( 'myApp' )
  .controller( 'ApercuCtrl', [ '$scope', '$location', '$rootScope', '$state', 'Menus', 'MessageService', '$sce',
    function ( $scope, $location, $rootScope, $state, Menus, MessageService, $sce ) {

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