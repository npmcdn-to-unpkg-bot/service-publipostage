/******************************************************************************************/
/*                       Service Resources                                                */
/******************************************************************************************/

angular.module( 'publipostageClientApp' )
    .factory( 'Publipostages',
              [ '$resource', 'BASE_SERVICE_URL',
                function ( $resource, BASE_SERVICE_URL ) {
                    return $resource( BASE_SERVICE_URL + '/publipostages/:id',
                                      { id: '@id' } );
                } ] )
    .factory( 'Regroupements',
              [ '$resource', 'BASE_SERVICE_URL',
                function ( $resource, BASE_SERVICE_URL ) {
                    return $resource( BASE_SERVICE_URL + '/regroupements/:id',
                                      { id: '@id' } );
                } ] )
    .factory( 'Etablissements',
              [ '$resource', 'BASE_SERVICE_URL',
                function ( $resource, BASE_SERVICE_URL ) {
                    return $resource( BASE_SERVICE_URL + '/etablissements/:id',
                                      { id: '@id' } );
                } ] )
    .factory( 'Profils',
              [ '$resource', 'BASE_SERVICE_URL',
                function ( $resource, BASE_SERVICE_URL ) {
                    return $resource( BASE_SERVICE_URL + '/profils' );
                } ] )
    .factory( 'Personnels',
              [ '$resource', 'BASE_SERVICE_URL',
                function ( $resource, BASE_SERVICE_URL ) {
                    return $resource( BASE_SERVICE_URL + '/etablissements/personnels' );
                } ] )
    .factory( 'Matieres',
              [ '$resource', 'BASE_SERVICE_URL',
                function ( $resource, BASE_SERVICE_URL ) {
                    return $resource( BASE_SERVICE_URL + '/etablissements/matieres' );
                } ] )
    .factory( 'DiffusionInfo',
              [ '$resource', 'BASE_SERVICE_URL',
                function ( $resource, BASE_SERVICE_URL ) {
                    return $resource( BASE_SERVICE_URL + '/diffusion_info/:population/:regroupements',
                                      { population: '@population',
                                        regroupements: '@regroupements' } );
                } ] );
