'use strict';
/* service authentication */
angular.module('services.authentication', []);
angular.module('services.authentication').factory('currentUser', function(){
    var currentUser = {} ; 
    currentUser.user = null; 
    currentUser.info = {};
    currentUser.etablissement = null; 
    return currentUser; 
});

angular.module('services.authentication').factory('security', ['$http', '$q', '$location', function($http, $q, $location) {

  // Redirect to the given url (defaults to '/')
  function redirect(url) {
    url = url || '/';
    $location.path(url);
  }

  // The public API of the service
  var service = {

    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    requestCurrentUser: function() {
      if ( service.isAuthenticated() ) {
        return $q.when(service.currentUser);
      } else {
        return $http.get('/app/current-user').then(function(response) {
          console.log(response);  
          service.currentUser = response.data;
          return service.currentUser;
        });
      }
    },

    // Information about the current user
    currentUser: null,

    // Is the current user authenticated?
    isAuthenticated: function(){
      return !!service.currentUser;
    },
    
    // Is the current user an adminstrator?
    isSuperAdmin: function() {
      return !!(service.currentUser && service.currentUser.admin);
    },
    
    isAdminEtab:function(){
            
    },
    
    isEnseignant:function(){
        
    },
    
    isCPE: function(){
        
    },
    
    isEleve: function(){
        
    },
    
    isParent:function(){
        
    }
    
  };

  return service;
}]);
