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
angular.module('services.messages').service('MessageService', ['$rootScope' ,function ($rootScope) {

  this.reset = function() {
    $rootScope.messageObject = { 
        message:'',
        title:'',
        destinations:[],
        messageType:'',
        diffusion_type:'', 
        profils:[],
        matiere: ''
      };
    };

    this.init = function() {
      if(sessionStorage != undefined && sessionStorage.messageObject != undefined ) {
        try {
          $rootScope.messageObject = JSON.parse(sessionStorage.messageObject);
        } catch (e) {}
      }
      if($rootScope.messageObject == undefined) {
        this.reset() ;
      }
    };
    
    this.init();
    
    $rootScope.$watch('messageObject' , function () {
      if(sessionStorage != undefined) {
        sessionStorage.messageObject = JSON.stringify($rootScope.messageObject);
      }
    }, true);

    // add Message  
    this.addMessage = function(message, title) {
        $rootScope.messageObject['message'] = message;
        $rootScope.messageObject['title'] = title;
    }
    
    this.clearMessage = function(){
        $rootScope.messageObject['message'] = '';
        $rootScope.messageObject['title'] = '';
    }
    
    this.getMessage = function() {
        return $rootScope.messageObject;
    }
    
    this.addDestinations = function(arry){
        $rootScope.messageObject['destinations'] = arry;
    }
    
    this.clearDestinations = function(){
        $rootScope.messageObject['destinations'] = [];
    }

    this.addProfils = function(arry){
        $rootScope.messageObject['profils'] = arry;
    }

    this.clearProfils = function(){
        $rootScope.messageObject['profils'] = [];
    }
    
    this.setDiffusionType = function(diffusion_type){
        $rootScope.messageObject['diffusion_type'] = diffusion_type;
    }
    
    this.clearDiffusionType = function(){
        $rootScope.messageObject['diffusion_type'] = '';
    }
    
    this.addMessageType = function(type){
      $rootScope.messageObject['messageType'] = type;
    }

    this.isValid = function(forPage){
      switch(forPage) {
        case "destinataire":
          var valid = ($rootScope.messageObject['messageType']== '' || $rootScope.messageObject['messageType']== null) ? false : true;
          return valid;
          break;
        case "message":
          var valid = ($rootScope.messageObject['messageType']==""|| $rootScope.messageObject['destinations'].length==0) ? false : true;
          return valid;
          break;
        case "apercu":
          console.log('Yaaaaa');
          return true;
          break
        case "mode_diffusion":
          console.log('mode_diffusion yuuu');
          return true;
          break
      }
    }

    this.setMatiere = function (matiere) {
      $rootScope.messageObject['matiere'] = matiere;
    };
}]);

/************************************************************************************/
