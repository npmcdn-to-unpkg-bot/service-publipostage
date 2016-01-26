'use strict';

var myDirectives = angular.module( 'services.directives', [] );
angular.module( 'services.directives' )
    .directive( 'myDirective',
                function () {
                    return {
                        template: '<div></div>',
                        restrict: 'E',
                        link: function postLink( scope, element, attrs ) {
                            element.text( 'this is the myDirective directive' );
                        }
                    };
                } )
    .directive( 'gritterAdd',
                [ '$rootScope',
                  function ( $rootScope ) {
                      return {
                          restrict: 'A',
                          link: function ( scope, element ) {
                              scope.$watch( 'grittorMessage', function ( newmsg ) {
                                  if ( !angular.isUndefined( newmsg ) ) {
                                      element.gritter.add( {
                                          title: 'Annonce de ' + newmsg.from + ' le ' + newmsg.at,
                                          text: newmsg.msg,
                                          image: '',
                                          sticky: true,
                                          time: ''
                                      } );
                                  }
                              } );
                          },
                          controller: [ '$scope', function ( $scope ) {
                              $rootScope.$on( "growlMessage", function ( event, message ) {
                                  $scope.grittorMessage = message;
                              } );
                          } ]
                      };
                  } ] );
