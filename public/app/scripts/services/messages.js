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


angular.module('services.messages').service('MessageService', function () {
    var messageObject = { message:'',
                        title:'',
                        destination:[],
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
    
    this.addDestinations = function(d){
        messageObject['destination'].push(d);
    }
    
    this.deleteDestination = function(d){
        var index = messageObject['destination'].indexOf(d);
        if (index > -1) {
            messageObject['destination'].splice(index,1);
        }
    }
    this.clearDestination = function(){
        messageObject['destination'] = [];
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
    
    this.addType = function(type){
        messageObject['messageType'] = type;
        console.log(messageObject);
    }  
});

/************************************************************************************/
