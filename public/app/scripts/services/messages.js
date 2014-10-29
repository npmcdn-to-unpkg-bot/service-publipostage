'use strict';

/************************************************************************************/
/*                   service to show flash messages and responses                  */
/************************************************************************************/
angular.module('services.messages', []); 

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

/* MessageService is the service that represents the sent message */
angular.module('services.messages').service('MessageService', function () {
    var messageObject = { message:'',
                        title:'',
                        destinations:[],
                        messageType:'',
                        diffusion_type:'', 
                        profils:[]
    };
    // add Message  
    this.addMessage = function(message, title) {
        messageObject['message'] = message;
        messageObject['title'] = title;
    }
    
    this.clearMessage = function(){
        messageObject['message'] = '';
        messageObject['title'] = '';
    }
    
    this.getMessage = function() {
        return messageObject;
    }
    
    this.addDestinations = function(arry){
        messageObject['destinations'] = arry;
    }
    
    this.clearDestinations = function(){
        messageObject['destinations'] = [];
    }

    this.addProfils = function(arry){
        messageObject['profils'] = arry;
    }

    this.clearProfils = function(){
        messageObject['profils'] = [];
    }
    
    this.setDiffusionType = function(diffusion_type){
        messageObject['diffusion_type'] = diffusion_type;
    }
    
    this.clearDiffusionType = function(){
        messageObject['diffusion_type'] = '';
    }
    
    this.addMessageType = function(type){
        messageObject['messageType'] = type;
    }

    this.isValid = function(forPage){
        switch(forPage) {
            case "destinataire":
                var valid = (messageObject['messageType']== '' || messageObject['messageType']== null) ? false : true;
                return valid;
                break;
            case "message":
                var valid = (messageObject['messageType']==""|| messageObject['destinations'].length==0) ? false : true;
                return valid;
                break;

        }
    }

    this.init = function(){
        messageObject = { message:'',
                        title:'',
                        destinations:[],
                        messageType:'',
                        sendType:[] };
    }

});

/************************************************************************************/
