'use strict';

angular.module( 'myApp' )
  .controller( 'HomeCtrl', [ '$scope', '$location', '$rootScope', '$stateParams',
    'security', 'Publipostages', 'currentUser', 'MessageService', 'Redirect', 'Squares',
    'SVG_AVATAR_F', 'SVG_AVATAR_M',
    function ( $scope, $location, $rootScope, $stateParams,
      security, Publipostages, currentUser, MessageService, Redirect, Squares,
      SVG_AVATAR_F, SVG_AVATAR_M ) {
      $scope.Redirect = Redirect;
      $scope.security = security;
      $scope.squares = Squares;

      $scope.addMessageType = function ( type ) {
        MessageService.addMessageType( type );
      };

      Publipostages.get( {},
        function ( publis ) {
          $scope.publis = publis.data;
        } );

      security.requestCurrentUser()
        .then( function ( user ) {
          $scope.currentUser = user;
          $scope.color = "#EB5454";
          if ( user.info[ 'LaclasseSexe' ] == "M" ) {
            $scope.avatar = SVG_AVATAR_M;
          } else if ( user.info[ 'LaclasseSexe' ] == "F" ) {
            $scope.avatar = SVG_AVATAR_F;
          } else {
            $scope.avatar = "";
          }
        } );
    }
  ] );