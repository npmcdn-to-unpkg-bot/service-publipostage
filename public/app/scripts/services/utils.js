'use strict';

/************************************************************************************/
/*                   utils service      								            */
/************************************************************************************/
angular.module('services.utils', ['faye']); 
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
        },
        goToPreview: function(location){
            $location.path('/apercu/'+location);
        },
        goToAnnonce: function(location){
            $location.path('/annonce/'+location);
        }

  	}
}]);

// faye client angular..
angular.module('services.utils').factory('Faye', ['$faye', function($faye){
        return $faye("http://localhost:7000/faye");
    }
]);