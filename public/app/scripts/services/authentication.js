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

    // Information about the current user
    currentUser: null,

    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    requestCurrentUser: function() {
      if ( service.isAuthenticated() ) {
        return $q.when(service.currentUser);
      } else {
        return $http.get('/app/current-user').then(function(response) {
          service.currentUser = response.data;
          return service.currentUser;return $http.get('/app/current-user').then(function(response) {
          service.currentUser = response.data;
          return service.currentUser;
        });
        });
      }
    },

    // Is the current user authenticated?
    isAuthenticated: function(){
      return !!service.currentUser;
    },
    
    // Is the current user a super adminstrator?
    isSuperAdmin: function() {
      if (service.isAuthenticated()) {
        return service.currentUser.roles_max_priority_etab_actif >= 3;
      } else{
        return false;
      }
    },

    // Is the current user a super adminstrator?
    getRoleMaxPriority: function() {
      if (service.isAuthenticated()) {
        return service.currentUser.roles_max_priority_etab_actif
      }else{
        return false;
      }
    },

    isAuthorized:function(allowedRoles){
      if (allowedRoles == "all"){
        return true
      }
      else
      {
        var allowed = _.filter(allowedRoles, function(allowedRole){
          return !!(_.find(service.currentUser.roles, function (role) {
              return  _.contains(role, allowedRole);
          }));
        });
        return !(_.isEmpty(allowed));
      }
    }
  };

  return service;
}]);
