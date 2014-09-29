/******************************************************************************************/
/*                       Service Resources                                                */
/******************************************************************************************/

angular.module('services.resources', ['ngResource', 'services.constants']);

/******************************************************************************************/
/*                      Resources                                                         */
/******************************************************************************************/
angular.module('services.resources').factory('Publipostages', ['$resource','BASE_SERVICE_URL',  function($resource, BASE_SERVICE_URL) {
    var baseUrl = BASE_SERVICE_URL +'/publipostages/:id'; 
    return $resource(baseUrl,{id:'@id'}, {
        'get': {method:'GET', params:{id:''}},
        'all': {method:'GET',  params:{id:''}, isArray:true},
        'save':{method:'POST'},
        'remove':{method:'DELETE'},
        'update':{method:'PUT'}
    });
}]);

angular.module('services.resources').factory('Regroupements', ['$resource', 'BASE_SERVICE_URL', function($resource, BASE_SERVICE_URL){
    var baseUrl = BASE_SERVICE_URL +'/regroupements/:id';
    return $resource(baseUrl,{id:'@id'}, {
        'get': {method:'GET'},
        'all': {method:'GET',  params:{id:''}, isArray:true}
    });
}]);

angular.module('services.resources').factory('Etablissements', ['$resource', 'BASE_SERVICE_URL', function($resource, BASE_SERVICE_URL){
    var baseUrl = BASE_SERVICE_URL +'/etablissements/:id';
    return $resource(baseUrl,{id:'@id'}, {
        'get': {method:'GET'},
        'all': {method:'GET',  params:{id:''}, isArray:true}
    });
}]);

angular.module('services.resources').factory('Profils', ['$resource', 'BASE_SERVICE_URL', function($resource, BASE_SERVICE_URL){
    var baseUrl = BASE_SERVICE_URL +'/profils';
    return $resource(baseUrl,{id:'@id'}, {
        'get': {method:'GET'},
        'all': {method:'GET',  params:{id:''}, isArray:true}
    });
}]);

angular.module('services.resources').factory('Personnels', ['$resource', 'BASE_SERVICE_URL', function($resource, BASE_SERVICE_URL){
    var baseUrl = BASE_SERVICE_URL +'/etablissements/:uai/personnels';
    return $resource(baseUrl, {uai:'@uai'}, {
        'all': {method:'GET', isArray:true}
    });
}]);

angular.module('services.resources').factory('DiffusionInfo', ['$resource', 'BASE_SERVICE_URL', function($resource, BASE_SERVICE_URL){
    var baseUrl = BASE_SERVICE_URL +'/diffusionInfo/:population/:regroupements'
    return $resource(baseUrl, {}, {
      'listStudents':   {method:'GET', url:BASE_SERVICE_URL + '/diffusionInfo/students/:regroupements'},
      'listProfessors': {method:'GET', url:BASE_SERVICE_URL + '/diffusionInfo/professors/:regroupements'},
      'listFamilly':    {method:'GET', url:BASE_SERVICE_URL + '/diffusionInfo/familly/:regroupements'} 
    });
}]);
