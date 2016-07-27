'use strict';

angular.module( 'publipostageClientApp' )
  .controller( 'MessageCtrl',
               [ '$scope', '$rootScope', 'MessageService', 'Menus', '$state', 'templateItems', 'security',
                 function ( $scope, $rootScope, MessageService, Menus, $state, templateItems, security ) {
                     $scope.templateItems = templateItems;

                     // load message from the root ..
                     $scope.title = MessageService.getMessage().title;
                     $scope.htmlMessage = MessageService.getMessage().message;

                     // get the list of menus
                     $scope.menus = Menus;

                     String.prototype.endsWith = function ( suffix ) {
                         return this.indexOf( suffix, this.length - suffix.length ) !== -1;
                     };

                     $scope.addToMessage = function ( text ) {
                         security.requestCurrentUser().then( function ( user ) {
                             if ( _( $scope.htmlMessage ).isString() && !_($scope.htmlMessage).isEmpty() && !( $scope.htmlMessage.endsWith( "&nbsp;" ) || $scope.htmlMessage.endsWith( "<br/>" ) || $scope.htmlMessage.endsWith( "</p>" ) ) ) {
                                 $scope.htmlMessage += ' ';
                             }
                             $scope.htmlMessage += text;
                         } );
                     };

                     $scope.goToPreview = function ( location ) {
                         MessageService.addMessage( $scope.htmlMessage, $scope.title );
                         $state.go( 'apercu', { type: location } );
                     };

                     $scope.goToDestinataire = function ( location ) {
                         $state.go( 'destinataire', { type: location } );
                     };
                 }
               ] );
