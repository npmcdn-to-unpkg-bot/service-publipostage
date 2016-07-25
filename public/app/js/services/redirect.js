'use strict';

/************************************************************************************/
/*                   utils service                                                  */
/************************************************************************************/
angular.module( 'publipostageClientApp' )
    .factory( 'Redirect',
              [ '$location', '$state',
                function ( $location, $state ) {
                    return { goTo: function( view, params ) {
                        $state.go( view, params, { location: true, reload: true } );
                    } };
                }
              ] );
