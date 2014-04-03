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


angular.module('services.messages').factory("MessageObject", ['$rootScope', function($rootScope){
    var messageObject = {};
    return {
    
        clearMessage: function() {
          messagObject['message'] = '';
        },
        addDestinations:function(a){
            messageObject['destination'] = a;
        },
        get: function(){
            return $rootScope.message;
        }
    }
}]);


/* MessageService is the service that represents the sent message */
angular.module('services.messages').service('MessageService', function () {
    var messageObject = { message:'',
                        title:'',
                        destinations:[],
                        messageType:'',
                        sendType:[]
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
    
    this.addSendType = function(sendType){
        messageObject['sendType'].push(sendType);
    }
    
    this.removeSendType = function(sendType){
        var index = messageObject['sendType'].indexOf(sendType);
        if (index > -1) {
            messageObject['sendType'].splice(index,1);
        }
    }
    
    this.addMessageType = function(type){
        messageObject['messageType'] = type;
        console.log(messageObject);
    }  
});

/************************************************************************************/
