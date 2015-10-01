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
        destinataires_libelle:'',
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

    // Load Message  
    this.loadMessage = function(publipostage) {
      $rootScope.messageObject['id'] =                    publipostage.id;
      $rootScope.messageObject['date'] =                  publipostage.date;
      $rootScope.messageObject['message'] =               publipostage.message;
      $rootScope.messageObject['profils'] =               publipostage.profils;
      $rootScope.messageObject['messageType'] =           publipostage.message_type;
      $rootScope.messageObject['title'] =                 publipostage.descriptif;
      $rootScope.messageObject['matiere'] =               publipostage.matiere_enseignee_id;
      $rootScope.messageObject['destinataires_libelle'] = publipostage.destinataires_libelle;
      $rootScope.messageObject['diffusion_type'] =        publipostage.diffusion_type; 
      if (publipostage.personnels != null) {
        this.addDestinations(publipostage.personnels);
      } else{
        this.addDestinations(publipostage.destinataires);
      }
    }
    
    // add Message  
    this.addMessage = function(message, title) {
        $rootScope.messageObject['message'] = message;
        $rootScope.messageObject['title'] = title;
    }
    
    this.clearMessage = function(){
        $rootScope.messageObject['message'] = '';
        $rootScope.messageObject['title'] = '';
    }
    
    this.addDestinations = function(arry){
        $rootScope.messageObject['destinations'] = arry;
    }
    
    this.addDestinatairesLabel = function (str) {
        $rootScope.messageObject['destinataires_libelle'] = str;
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
        case "mode_diffusion":
        case "apercu" :
          var valid = !_.isEmpty($rootScope.messageObject['message']);
          if(!valid) return false;
        case "message":
          var valid = !_.isEmpty($rootScope.messageObject['destinations']);
          if(!valid) return false;
        case "destinataire":
          var valid = !_.isEmpty($rootScope.messageObject['messageType']);
          if(!valid) return false;
      }
      return true;
    }

    this.setMatiere = function (matiere) {
      $rootScope.messageObject['matiere'] = matiere;
    };

  // Getters
  this.getMessage = function() {
      return $rootScope.messageObject;
  }

}]);

/************************************************************************************/
