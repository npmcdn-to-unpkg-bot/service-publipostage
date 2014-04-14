'use strict';

/* Controllers */

var Controllers  =  angular.module('myApp.controllers', []);

Controllers.controller('TestCtrl', ['$rootScope','security', 'Publipostages', 'currentUser', 'SVG_AVATAR_F', 'SVG_AVATAR_M', "$location", function($scope, security, Publipostages, currentUser, SVG_AVATAR_F, SVG_AVATAR_M, $location) {
    $scope.tinymceOptions = {
        language:"fr"
    };
    
    Publipostages.all({}, function(publis){
        $scope.publis = publis
    });
    
    security.requestCurrentUser().then(function(user) {
      //console.log(user);
      $scope.currentUser = user;
      $scope.color = "#EB5454";
      if (user.info['LaclasseSexe']=="M") {
        $scope.avatar = SVG_AVATAR_M
      } else if (user.info['LaclasseSexe']=="F") {
        $scope.avatar = SVG-AVATAR_F;
      }
      else{
        $scope.avatar = "";
      }
      
    });
    
    $scope.goTo = function(location){le
        $location.path(location);
    }
    
    $scope.colors = [ 'bleu', 'vert', 'rouge', 'violet', 'orange',
                        'jaune', 'gris1','gris2', 'gris3', 'gris4' ];

}]);

Controllers.controller('HomeCtrl', ['$scope','security', 'Publipostages', 'currentUser', 'SVG_AVATAR_F', 'SVG_AVATAR_M', "$location", "$rootScope", "$stateParams", "MessageService", 'Redirect','Squares',
    function($scope, security, Publipostages, currentUser, SVG_AVATAR_F, SVG_AVATAR_M, $location, $rootScope,  $stateParams, MessageService, Redirect, Squares) {
        $scope.Redirect = Redirect;   
        
        $scope.tinymceOptions = {
            language:"fr"
        };

        $scope.security = security;

        Publipostages.all({}, function(publis){
            $scope.publis = publis
        });
        
        $scope.addMessageType = function(type){
            MessageService.addMessageType(type);
        }

        $scope.squares = Squares;
        
        security.requestCurrentUser().then(function(user) {
            //console.log(user);
            $scope.currentUser = user;
            $scope.color = "#EB5454";
            if (user.info['LaclasseSexe']=="M") {
                $scope.avatar = SVG_AVATAR_M
            } else if (user.info['LaclasseSexe']=="F") {
                $scope.avatar = SVG-AVATAR_F;
            }
            else{
                $scope.avatar = "";
            }
        });
}]);

Controllers.controller('Ctrl2', [function() {

}]);

Controllers.controller('wizardController', ['$scope', function($scope){
    $scope.log = function(event){
        console.log(event);
    }
    $scope.user = {};
    $scope.etablissements = [];
}]);

/*                                          Main controller of the application                                           */
Controllers.controller('MainCtrl', ['$scope', '$sce', 'security','Regroupements', '$location', '$rootScope', 'Message', 'MessageService','Redirect', 
    'colors', 'transparentColors', 'Menus','tinymceOptions', '$state', 'Publipostages',
    function($scope, $sce, security, Regroupements, $location, $rootScope, Message, MessageService, Redirect, colors, transparentColors, Menus, tinymceOptions, $state, Publipostages){
        // making Redirect utils accesible in the scope
        $scope.Redirect = Redirect;
        $scope.security = security;
        // if current state == destinataire
        if ($state.current.name == "destinataire") {
            MessageService.addMessageType($state.params['type']);
            console.log(MessageService.getMessage());
            //console.log($scope.greeting);
            //$scope.greeting = greeting;
            /*$scope.greeting().then(function(data){
                  conosle.log(data);
            }, function(error){
                conosle.log(error);
            })*/
        }
        /*
        $scope.square_style = {
            'background-image' : $scope.menus[$state.params['type']].icon
        }
        */
        // editor tinyMce  options;
        $scope.tinymceOptions =  tinymceOptions;

        //initialize destinations
        $scope.destinations = [];
        
        security.requestCurrentUser().then(function(user) {
            //console.log(user);
            $scope.currentUser = user;
            console.log(user.info['uid']);
            Regroupements.get({id:user.info['uid']}, function(regroupements){
                console.log(regroupements);
                $scope.regroupements = regroupements;
                // add colors to classes
                $scope.regroupements['classes'].forEach(function(element, index, array){
                    element['color'] = $scope.randomTransparentColor();
                });
                
                // add colors to groupes
                $scope.regroupements['groupes_eleves'].forEach(function(element, index, array){
                    element['color'] = $scope.randomTransparentColor();
                });
                
                // Add colors to empty squres
                if (($scope.regroupements['classes'].length + $scope.regroupements['groupes_eleves'].length) < 15) {
                    $scope.empty_squares = new Array(15 - ($scope.regroupements['classes'].length + $scope.regroupements['groupes_eleves'].length));
                    console.log($scope.empty_squares);
                    for (var i=0;i<$scope.empty_squares.length;i++){
                      $scope.empty_squares[i]={ color:$scope.randomTransparentColor()};
                    }    
                } else
                {
                    $scope.empty_squares = []
                }
                
                console.log($scope.empty_squares);  
                
            });
        });
        
        // get the list of menus
        $scope.menus = Menus;
        
        /* select all functionality */
        $scope.selectAllMode = true;
        
        $scope.selectAll = function(){
            $scope.selectAllMode = false;
            $scope.regroupements['classes'].forEach(function(element, index, array){
                if (!element['checked'] || element['checked'].isUndefined){
                    element['checked'] = true;
                    $scope.destinations.push(element);
                    $scope.changeClassColor(index);
                }
            });
        }
        
        $scope.deselectAll = function(){
            $scope.selectAllMode = true;
            $scope.destinations = [];
            $scope.regroupements['classes'].forEach(function(element, index, array){
                if(element['checked'] || element['checked'].isUndefined){
                    element['checked'] = false;
                    $scope.changeClassColor(index);
                }
            });
        }
 
        $scope.addToMessage = function(text){
            $scope.tinyMessage = $scope.tinyMessage + text;
        }
        
        $scope.goToPreview = function(location){
            MessageService.addMessage($scope.tinyMessage, $scope.title)
            console.log(MessageService.getMessage());
            $location.path('/apercu/'+location);
        }
        
        $scope.goBackToMessage = function(location){
            console.log(Message.get());
            $scope.tinyMessage = MessageService.getMessage()['message'];
            $location.path('/message/'+location);
        }
        
        $scope.addType = function(){
            MessageService.addType('test');
        }
        
        // load message from the root ..
        $scope.tinyMessage = MessageService.getMessage()['message'];
        
        
        $scope.addDestinations = function(){
            console.log('add destinations');
            MessageService.addDestinations($scope.destinations);
            console.log(MessageService.getMessage());
        }
        
        $scope.addRemoveDestination = function(object){
            var index = $scope.destinations.indexOf(object)
            if(index > -1){
                $scope.destinations.splice(index,1);
            }else{
                $scope.destinations.push(object);
            }
        }
        $scope.sendMessage = function(location){
            var message = MessageService.getMessage();
            if (message.title != "" && message.message!=""){
                Publipostages.save({'descriptif': message.title, 'message': message.message}, function(succcess){
                    console.log(success);
                }
                    , function(error){
                        console.log(error);
                });
            }
            $location.path('/envoi/'+location);
        }

        $scope.randomColor = function() {
            var index = Math.floor(Math.random()*(colors.length));
            console.log(index);
            return colors[index];
        };
        
        $scope.randomTransparentColor = function() {
            var index = Math.floor(Math.random()*(transparentColors.length));
            return transparentColors[index];
        };
        
        
        $scope.toTrustedHtml = function(html_code) {
            return $sce.trustAsHtml(html_code);
        }

        $scope.changeClassColor = function($index){
            var color = $scope.regroupements['classes'][$index]['color']; 
            var match = color.search("-clear");
            if (match==-1) {
                color = color+"-clear";
            }else
            {
                color = color.substr(0,match);
            }
            
            $scope.regroupements['classes'][$index]['color']=color;
            
        }
        
        $scope.changeGroupColor = function($index){
            var color = $scope.regroupements['groupes_eleves'][$index]['color']; 
            var match = color.search("-clear");
            if (match==-1) {
                color = color+"-clear";
            }else
            {
                color = color.substr(0,match)
            }
            
            $scope.regroupements['groupes_eleves'][$index]['color']=color;
        }
        
        $scope.square = {icone: $rootScope.racine_images + '00_vide.svg'};
        
        /*              watch variables                             */
        $scope.$watch("byMail", function(newVal) {
            if (angular.isUndefined(newVal) || newVal == null) return;
            console.log(newVal);
            if (newVal) {
                MessageService.addSendType('byMail');
                console.log(MessageService.getMessage());
            }else{
                
                MessageService.removeSendType('byMail');
                console.log(MessageService.getMessage());
            }
        });
        
        $scope.$watch("byPdf", function(newVal) {
            if (angular.isUndefined(newVal) || newVal == null) return;
            console.log(newVal);
            if (newVal) {
                MessageService.addSendType('byPdf');
                console.log(MessageService.getMessage());
            }else{
                
                MessageService.removeSendType('byPdf');
                console.log(MessageService.getMessage());
            }
        });
        
        $scope.$watch("byNotif", function(newVal) {
            if (angular.isUndefined(newVal) || newVal == null) return;
            console.log(newVal);
            if (newVal) {
                MessageService.addSendType('byNotif');
                console.log(MessageService.getMessage());
            }else{
                
                MessageService.removeSendType('byNotif');
                console.log(MessageService.getMessage());
            }
        });

        // watch destinations (array)
        $scope.$watch('destinations', function(newVal){
            console.log(newVal);
        }, true);
    
}]);

Controllers.controller('AnnonceCtrl', ['$scope', 'AnnonceSquares', 'Redirect', function($scope, AnnonceSquares, Redirect){
    $scope.annonceSquares = AnnonceSquares;
    $scope.Redirect = Redirect;
}]);

Controllers.controller('InfoFamilleCtrl', ['$scope', function($scope){

}]); 


