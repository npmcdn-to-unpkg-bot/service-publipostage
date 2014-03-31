'use strict';

/************************************************************************************/
/*                   service to show flash messages and responses                  */
/************************************************************************************/
angular.module('services.messages', []); 
angular.module('services.messages').factory("FlashService", ['$rootScope', function($rootScope) {
  return {
    show: function(message) {
      $rootScope.flash = message;
    },
    clear: function() {
      $rootScope.flash = "";
    }
  }
}]);
angular.module('services.messages').factory("FlashServiceStyled", ['$rootScope', function($rootScope) {
  return {
    show: function(message, classe) {
      $rootScope.flashMessage = message;
      $rootScope.flashStyle = classe
    },
    clear: function() {
      $rootScope.flashMessage = "";
      $rootScope.flashStyle ="alert"; 
    }
  }
}]);

angular.module('services.messages').factory("Message", ['$rootScope', function($rootScope) {
  return {
    add: function(message) {
      $rootScope.message = message;
    },
    clear: function() {
      $rootScope.message = "";
    },
    get: function(){
        return $rootScope.message;
    }
  }
}]);
/************************************************************************************/
