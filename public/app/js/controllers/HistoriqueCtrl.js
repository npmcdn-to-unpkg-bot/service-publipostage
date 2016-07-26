'use strict';

angular.module( 'publipostageClientApp' )
    .controller( 'HistoriqueCtrl',
                 [ '$rootScope', '$sce', '$q', 'security', 'Publipostages', 'Redirect', 'MessageService',
                   function ( $scope, $sce, $q, security, Publipostages, Redirect, MessageService ) {
                       $scope.pageLimits = [ 5, 10, 20, 50 ];
                       $scope.limit = 20;
                       $scope.currentPage = 1;
                       $scope.maxSize = 5;
                       $scope.check_all = false;

                       $scope.checked_many = function() {
                           return _($scope).has( 'publis' ) && _($scope.publis.data).where({ checked: true }).length > 0;
                       };

                       var getPublipostages = function ( page, limit ) {
                           Publipostages.get( { limit: limit,
                                                page: page } )
                               .$promise.then( function ( response ) {
                                   $scope.publis = response;
                                   _($scope.publis.data).each( function( publi ) {
                                       publi.checked = false;
                                   } );
                               } );
                       };

                       $scope.toTrustedHtml = function ( html_code ) {
                           return $sce.trustAsHtml( html_code );
                       };

                       $scope.relancerPubli = function ( id, location ) {
                           // Récupérer le publipostage sur la base de l'id.
                           Publipostages.get( { id: id } )
                               .$promise.then( function ( success ) {
                                   MessageService.init();
                                   MessageService.loadMessage( success );

                                   Redirect.goTo( location, { type: MessageService.getMessage()[ 'messageType' ] } );
                               } );
                       };

                       $scope.removePubli = function ( id ) {
                           if ( confirm( "Voulez-vous supprimer le publipostage ?" ) ) {
                               Publipostages.remove( { id: id } )
                                   .$promise.then( function ( success ) {
                                       getPublipostages( $scope.currentPage, $scope.limit );
                                   } );
                           }
                       };

                       $scope.pageChanged = function ( newValue ) {
                           getPublipostages( newValue, $scope.limit );
                       };

                       $scope.limitChanged = function ( newValue ) {
                           $scope.limit = newValue;
                           $scope.currentPage = 1;
                           getPublipostages( $scope.currentPage, newValue );
                       };

                       $scope.selectAll = function () {
                           $scope.check_all = !$scope.check_all;
                           _($scope.publis.data).each( function( publi ) {
                               publi.checked = !publi.checked;
                           } );
                       };

                       $scope.removeSelectedPubli = function () {
                           if ( confirm( "Voulez-vous supprimer le(s) publipostages sélectionné(s) ?" ) ) {
                               var promesses = _.chain($scope.publis.data)
                                   .where({ checked: true })
                                   .map( function( publi ) {
                                       return Publipostages.remove( { id: publi.id } ).$promise;
                                   } )
                                   .value();

                               $q.all( promesses ).then( function( success ) {
                                   getPublipostages( $scope.currentPage, $scope.limit );
                               } );
                           }
                       };

                       getPublipostages( $scope.currentPage, $scope.limit );

                       security.requestCurrentUser().then( function( user ) {
                           $scope.currentUser = user;
                       } );
                   }
                 ] );
