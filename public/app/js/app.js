'use strict';

angular.module( 'publipostageClientApp', [ 'angular-underscore',
                                           'checklist-model',
                                           'chieffancypants.loadingBar',
                                           'ngResource',
                                           'ngSanitize',
                                           'pdf',
                                           'textAngular',
                                           'ui.bootstrap',
                                           'ui.router',
                                           'ui.select2' ] )
    .config( [ '$urlRouterProvider', '$stateProvider', 'APPLICATION_PREFIX',
               function ( $urlRouterProvider, $stateProvider, APPLICATION_PREFIX ) {
                   var checkMessage = function ( forPage ) {
                       return function ( $q, $timeout, MessageService ) {
                           var deferred = $q.defer();
                           if ( MessageService.isValid( forPage ) ) {
                               deferred.resolve( 'valid message' );
                           } else{
                               deferred.reject( 'invalid message' );
                           }
                           return deferred.promise;
                       };
                   };

                   /* defining states for routing */
                   $stateProvider
                       .state( { name: 'home',
                                 url: '/',
                                 templateUrl: APPLICATION_PREFIX + '/views/home.html',
                                 controller: 'HomeCtrl',
                                 authorizedRoles: [ 'TECH', 'ADM_ETB', 'PROF_ETB' ] } )
                       .state( { name: 'historique',
                                 url: '/historique',
                                 templateUrl: APPLICATION_PREFIX + '/views/historique.html',
                                 controller: 'HistoriqueCtrl',
                                 authorizedRoles: [ 'TECH', 'ADM_ETB', 'PROF_ETB' ] } )
                       .state( { name: 'destinataire',
                                 url: '/destinataire/:type',
                                 templateUrl: APPLICATION_PREFIX + '/views/destinataire.html',
                                 controller: 'destinatairesCtrl',
                                 authorizedRoles: [ 'TECH', 'ADM_ETB', 'PROF_ETB' ],
                                 resolve: { checkMessage: checkMessage( 'destinataire' ) } } )
                       .state( { name: 'message',
                                 url: '/message/:type',
                                 templateUrl: APPLICATION_PREFIX + '/views/message.html',
                                 controller: 'MessageCtrl',
                                 authorizedRoles: [ 'TECH', 'ADM_ETB', 'PROF_ETB' ],
                                 resolve: { checkMessage: checkMessage( 'message' ) } } )
                       .state( { name: 'apercu',
                                 url: '/apercu/:type',
                                 templateUrl: APPLICATION_PREFIX + '/views/apercu.html',
                                 controller: 'ApercuCtrl',
                                 authorizedRoles: [ 'TECH', 'ADM_ETB', 'PROF_ETB' ],
                                 resolve: { checkMessage: checkMessage( 'apercu' ) } } )
                       .state( { name: 'mode_diffusion',
                                 url: '/mode_diffusion/:type',
                                 templateUrl: APPLICATION_PREFIX + '/views/mode_diffusion.html',
                                 controller: 'ModeDiffusionCtrl',
                                 authorizedRoles: [ 'TECH', 'ADM_ETB', 'PROF_ETB' ],
                                 resolve: { checkMessage: checkMessage( 'mode_diffusion' ) } } )
                       .state( { name: 'envoi',
                                 url: '/envoi/:type',
                                 templateUrl: APPLICATION_PREFIX + '/views/envoi.html',
                                 controller: 'EnvoiCtrl',
                                 authorizedRoles: [ 'TECH', 'ADM_ETB', 'PROF_ETB' ] } )
                       .state( { name: 'error',
                                 url: '/error/:message',
                                 templateUrl: APPLICATION_PREFIX + '/views/error.html',
                                 authorizedRoles: 'all' } )
                       .state( { name: 'fichier',
                                 url: '/fichier/:id',
                                 templateUrl: APPLICATION_PREFIX + '/views/pdfviewer.html',
                                 controller: 'DocCtrl',
                                 authorizedRoles: [ 'TECH', 'ADM_ETB', 'PROF_ETB' ] } );

                   $urlRouterProvider.otherwise( '/' );

               }
             ] )
    .config( [ '$provide', '$httpProvider',
               function ( $provide, $httpProvider ) {
                   // Intercept http calls.
                   $provide.factory( 'HttpInterceptor',
                                     [ '$q', '$location',
                                       function ( $q, $location ) {
                                           return { request: function( config ) {
                                               return config || $q.when( config );
                                           },
                                                    requestError: function( rejection ) {
                                                        return $q.reject( rejection );
                                                    },
                                                    response: function( response ) {
                                                        return response || $q.when( response );
                                                    },
                                                    responseError: function( rejection ) {
                                                        if ( rejection.status == 0 || rejection.status == 403 || rejection.status == 401 ) {
                                                            $location.path( '/' );
                                                        }
                                                        if ( rejection.status == 400 || rejection.status == 404 || rejection.status == 500 ) {
                                                            $location.path( '/error/' + rejection.status );
                                                        }

                                                        return $q.reject( rejection );
                                                    }
                                                  };
                                       }
                                     ] );
                   // Add the interceptor to the $httpProvider.
                   $httpProvider.interceptors.push( 'HttpInterceptor' );
               }
             ] )
    .run( [ '$rootScope', 'FlashServiceStyled', 'security', '$state', 'MessageService', 'APPLICATION_PREFIX',
            function ( $rootScope, FlashServiceStyled, security, $state, MessageService, APPLICATION_PREFIX ) {
                $rootScope.showHeader = function ( argument ) {
                    try {
                        return window.self === window.top;
                    } catch ( e ) {
                        return true;
                    }
                };

                $rootScope.racine_images = APPLICATION_PREFIX + '/images/';

                // check authorization before changing states .
                $rootScope.$on( '$stateChangeStart', function ( event, toState, toParams, fromState, fromParams ) {
                    // before loading the new state => check rights
                    security.requestCurrentUser()
                        .then( function ( user ) {
                            if ( security.isAuthenticated() && !security.isAuthorized( toState.authorizedRoles ) && toState.url != fromState.url && fromState.url != '^' ) {
                                event.preventDefault();
                                $state.transitionTo( 'home' );
                            }
                        } );
                } );

                //check resolve errors ..
                $rootScope.$on( '$stateChangeError',
                                function ( event, toState, toParams, fromState, fromParams, error ) {
                                    if ( error == "invalid message" ) {
                                        event.preventDefault();
                                        alert( 'le message n\'est pas valide' );
                                        $state.transitionTo( 'home' );
                                    }
                                } );

                $rootScope.$state = $state;
                $rootScope.title = "title";

                window.scope = $rootScope;
                FlashServiceStyled.show( 'bienvenue dans le publispostage', 'alert alert-success' );
            }
          ] );
