'use strict';

angular.module( 'publipostageClientApp' )
  .controller( 'HomeCtrl',
               [ '$scope', '$rootScope', '$stateParams',
                 'security', 'Publipostages', 'MessageService', 'Redirect', 'Squares',
                 function ( $scope, $rootScope, $stateParams,
                            security, Publipostages, MessageService, Redirect, Squares ) {
                     $scope.Redirect = Redirect;
                     $scope.security = security;
                     $scope.squares = Squares;

                     $scope.addMessageType = function ( type ) {
                         MessageService.addMessageType( type );
                     };

                     Publipostages.get( {} )
                         .$promise
                         .then( function ( publis ) {
                             $scope.publis = publis.data;
                         } );

                     security.requestCurrentUser()
                         .then( function ( user ) {
                             $scope.currentUser = user;
                         } );
                 }
               ] );
