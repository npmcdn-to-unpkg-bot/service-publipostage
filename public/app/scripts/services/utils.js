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
        },
        goToEnvoi: function(location){
            $location.path('/envoi_annonce/'+location);
        }

  	}
}]);

// faye client angular..
angular.module('services.utils').factory('Faye', ['$faye', function($faye){
        
        // Return a mock object until really implemented
        return { 
            publish : function(a,b,c,d) {
                console.log('Faye[publish method called]')
            },
            subscribe : function(a,b,c,d) {
              console.log('Faye[subscribe method called]')
            }
        };

        /* Comment until realy implemented
        return $faye("http://localhost:7000/faye");
        */
    }
]);