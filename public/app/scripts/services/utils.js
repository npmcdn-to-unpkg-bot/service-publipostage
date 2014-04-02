'use strict';

/************************************************************************************/
/*                   utils service      								            */
/************************************************************************************/
angular.module('services.utils', []); 
angular.module('services.utils').factory("Redirect", ['$location', function($location) {
  	return {
	    goTo: function(location) {
	     	$location.path(location);
	    },
	    goToDestinataire:  function(location){
            $location.path('/destinataire/'+ location);
        },
        goToMessage: function(location){
            $location.path('/message/'+ location);
        },
        goToHistory: function(location){
            $location.path('/historique/'+location);
        }
  	}
}]);