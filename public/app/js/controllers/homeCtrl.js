'use strict';

angular.module( 'publipostageClientApp' )
  .controller( 'HomeCtrl',
               [ '$scope', '$rootScope', '$stateParams',
                 'security', 'MessageService', 'Redirect', 'Squares',
                 function ( $scope, $rootScope, $stateParams,
                            security, MessageService, Redirect, Squares ) {
                     $scope.Redirect = Redirect;
                     $scope.security = security;
                     $scope.squares = Squares;


                     security.requestCurrentUser()
                         .then( function ( user ) {
                             $scope.currentUser = user;
                         } );
                 }
               ] );
