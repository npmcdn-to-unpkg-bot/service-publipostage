'use strict';

angular.module( 'publipostageClientApp' )
    .controller( 'ListeCtrl',
                 [ '$rootScope', '$sce', 'security', 'Publipostages', 'SVG_AVATAR_F', 'SVG_AVATAR_M', '$location', 'MessageService',
                   function ( $scope, $sce, security, Publipostages, SVG_AVATAR_F, SVG_AVATAR_M, $location, MessageService ) {
                       $scope.pageLimits = [ 5, 10, 20, 50 ];
                       $scope.limit = 20;
                       $scope.currentPage = 1;
                       $scope.maxSize = 5;
                       $scope.checked = {};
                       $scope.check_all = false;

                       var getPublipostages = function ( page, limit ) {
                           Publipostages.get( {
                               limit: limit,
                               page: page
                           }, function ( publis ) {
                               $scope.publis = publis.data;

                               $scope.totalItems = publis.total;
                               $scope.currentPage = publis.page;
                           } );
                       };

                       $scope.toTrustedHtml = function ( html_code ) {
                           return $sce.trustAsHtml( html_code );
                       };

                       $scope.goTo = function ( location ) {
                           $location.path( location );
                       };

                       $scope.relancerPubli = function ( id, location ) {
                           // Récupérer le publipostage sur la base de l'id.
                           Publipostages.get( {
                               id: id
                           }, function ( success ) {
                               MessageService.init();
                               MessageService.loadMessage( success );
                               // rediriger à la rédaction du message /#/message/ecrire_tous
                               $location.path( '/' + location + '/' + MessageService.getMessage()[ 'messageType' ] );
                           },
                                              function ( error ) {
                                                  console.log( error );
                                              } );
                       };

                       $scope.removePubli = function ( id ) {
                           if ( confirm( "Voulez-vous supprimer le publipostage ?" ) ) {
                               Publipostages.remove( {
                                   id: id
                               }, function ( success ) {
                                   getPublipostages( $scope.currentPage, $scope.limit );
                               }, function ( error ) {
                                   console.log( error );
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
                           angular.forEach( $scope.publis, function ( publi ) {
                               $scope.checked[ publi.id ] = !$scope.checked[ publi.id ];
                           } );
                       };

                       $scope.selectPubli = function ( id ) {
                           console.log( id );
                       };

                       $scope.removeSelectedPubli = function () {
                           if ( confirm( "Voulez-vous supprimer les publipostages sélectionnés?" ) ) {
                               Publipostages.remove( {
                                   id: angular.toJson( $scope.checked )
                               },
                                                     function ( success ) {
                                                         $scope.check_all = false;
                                                         getPublipostages( $scope.currentPage, $scope.limit );
                                                     },
                                                     function ( error ) {
                                                         console.log( error );
                                                     } );
                           }
                       };

                       getPublipostages( $scope.currentPage, $scope.limit );

                       security.requestCurrentUser().then( function ( user ) {
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
