/******************************************************************************************/
/*                       Service Resources                                                */
/******************************************************************************************/

angular.module( 'publipostageClientApp' )
    .factory( 'Publipostages', [ '$resource', 'BASE_SERVICE_URL', function ( $resource, BASE_SERVICE_URL ) {
        var baseUrl = BASE_SERVICE_URL + '/publipostages/:id';
        return $resource( baseUrl, {
            id: '@id'
        }, {
            'get': {
                method: 'GET',
                params: {
                    id: ''
                }
            },
            'all': {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: true
            },
            'save': {
                method: 'POST'
            },
            'remove': {
                method: 'DELETE'
            },
            'update': {
                method: 'PUT'
            }
        } );
    } ] )
    .factory( 'Regroupements', [ '$resource', 'BASE_SERVICE_URL', function ( $resource, BASE_SERVICE_URL ) {
        var baseUrl = BASE_SERVICE_URL + '/regroupements/:id';
        return $resource( baseUrl, {
            id: '@id'
        }, {
            'get': {
                method: 'GET'
            },
            'all': {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: true
            }
        } );
    } ] )
    .factory( 'Etablissements', [ '$resource', 'BASE_SERVICE_URL', function ( $resource, BASE_SERVICE_URL ) {
        var baseUrl = BASE_SERVICE_URL + '/etablissements/:id';
        return $resource( baseUrl, {
            id: '@id'
        }, {
            'get': {
                method: 'GET'
            },
            'all': {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: true
            }
        } );
    } ] )
    .factory( 'Profils', [ '$resource', 'BASE_SERVICE_URL', function ( $resource, BASE_SERVICE_URL ) {
        var baseUrl = BASE_SERVICE_URL + '/profils';
        return $resource( baseUrl, {
            id: '@id'
        }, {
            'get': {
                method: 'GET'
            },
            'all': {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: true
            }
        } );
    } ] )
    .factory( 'Personnels', [ '$resource', 'BASE_SERVICE_URL', function ( $resource, BASE_SERVICE_URL ) {
        var baseUrl = BASE_SERVICE_URL + '/etablissements/personnels';
        return $resource( baseUrl, {}, {
            'all': {
                method: 'GET',
                isArray: true
            }
        } );
    } ] )
    .factory( 'Matieres', [ '$resource', 'BASE_SERVICE_URL', function ( $resource, BASE_SERVICE_URL ) {
        var baseUrl = BASE_SERVICE_URL + '/etablissements/matieres';
        return $resource( baseUrl, {}, {
            'all': {
                method: 'GET',
                isArray: true
            }
        } );
    } ] )
    .factory( 'DiffusionInfo', [ '$resource', 'BASE_SERVICE_URL', function ( $resource, BASE_SERVICE_URL ) {
        var baseUrl = BASE_SERVICE_URL + '/diffusion_info/:population/:regroupements';
        return $resource( baseUrl, {}, {
            'listStudents': {
                method: 'GET',
                url: BASE_SERVICE_URL + '/diffusion_info/students/:regroupements'
            },
            'listProfessors': {
                method: 'GET',
                url: BASE_SERVICE_URL + '/diffusion_info/professors/:regroupements'
            },
            'listFamilly': {
                method: 'GET',
                url: BASE_SERVICE_URL + '/diffusion_info/familly/:regroupements'
            }
        } );
    } ] );
