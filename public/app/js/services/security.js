'use strict';

angular.module( 'publipostageClientApp' )
    .factory( 'security',
              [ '$http', '$q', 'APPLICATION_PREFIX',
                function ( $http, $q, APPLICATION_PREFIX ) {
                    // The public API of the service
                    var service = { currentUser: null,

                                    requestCurrentUser: function() {
                                        if ( _(service.currentUser).isNull() ) {
                                            return $http.get( APPLICATION_PREFIX + "/current-user" ).then( function ( response ) {
                                                service.currentUser = response.data;
                                                return service.currentUser;
                                            } );
                                        } else {
                                            return $q.when( service.currentUser );
                                        }
                                    },

                                    isAuthenticated: function() {
                                        return !!service.currentUser;
                                    },

                                    isSuperAdmin: function() {
                                        return service.isAuthenticated() && service.currentUser.is_super_admin;
                                    },

                                    isAdmin: function() {
                                        return service.isAuthenticated() && service.currentUser.is_admin;
                                    },

                                    isAuthorized: function( allowedRoles ) {
                                        return service.isAuthenticated() && ( allowedRoles === "all" || _(allowedRoles).union( service.currentUser.roles ).length > 0 );
                                    }
                                  };

                    return service;
                } ] );
