'use strict';

/* Controllers */

var Controllers  =  angular.module('myApp.controllers', []);

Controllers.controller('publiCtrl', ['$rootScope', '$sce', 'security', 'Publipostages', 'currentUser', 'SVG_AVATAR_F', 'SVG_AVATAR_M', "$location", function($scope, $sce, security, Publipostages, currentUser, SVG_AVATAR_F, SVG_AVATAR_M, $location) {
    $scope.tinymceOptions = {
        language:"fr"
    };
    $scope.getPublipostages = function(){
        Publipostages.all({}, function(publis){
        $scope.publis = publis
        });
    }
    $scope.getPublipostages();
    
    $scope.toTrustedHtml = function(html_code) {
        return $sce.trustAsHtml(html_code);
    };

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
    $scope.goTo = function(location){
        $location.path(location);
    }
    
    $scope.colors = [ 'bleu', 'vert', 'rouge', 'violet', 'orange',
                        'jaune', 'gris1','gris2', 'gris3', 'gris4' ];
    
    $scope.removePubli = function(id){
        if(confirm("Voulez-vous supprimer le publipostage?")){
            Publipostages.remove({id:id}, function(success){
                $scope.getPublipostages();
            }, function(error){
                console.log(error);
            });
        }
    }
}]);
/********************************* Home page controller  *****************************************/
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
                $scope.avatar = SVG_AVATAR_F;
            }
            else{
                $scope.avatar = "";
            }
        });
}]);

Controllers.controller('Ctrl2', [function() {

}]);

/********************************* Wizard Controller *****************************************/
Controllers.controller('wizardController', ['$scope', function($scope){
    $scope.log = function(event){
        console.log(event);
    }
    $scope.user = {};
    $scope.etablissements = [];
}]);

/********************************* Main controller of the application *****************************************/
Controllers.controller('MainCtrl', ['$scope', '$sce', 'security','Regroupements', '$location', '$rootScope', 'Message', 'MessageService','Redirect', 
    'colors', 'transparentColors', 'Menus','tinymceOptions', '$state', 'Publipostages',
    function($scope, $sce, security, Regroupements, $location, $rootScope, Message, MessageService, Redirect, colors, transparentColors, Menus, tinymceOptions, $state, Publipostages){
        // making Redirect utils accesible in the scope
        $scope.Redirect = Redirect;
        $scope.security = security;

        // editor tinyMce  options;
        //$scope.tinymceOptions =  tinymceOptions;
        $scope.tinymceOptions = {
            language:"fr",
            menubar: false,
            theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
            font_size_style_values: "12px,13px,14px,16px,18px,20px",
            toolbar: "styleselect,fontsizeselect,sub,sup,|,bold,italic,underline,strikethrough,| alignleft,aligncenter,alignright | bullist,numlist",
            extended_valid_elements : "nom,civilite",
            custom_elements: "nom,civilite",
            verify_html : false,
            height : 200,
            handle_event_callback: function (e) {
                // put logic here for keypress
                console.log("callback called");
            }
        };
        //$scope.tinyMessage = "";

        //initialize destinations
        //$scope.destinations = [];
        $scope.tinyMessage = MessageService.getMessage()['message'];
        console.log($scope.tinyMessage);

        security.requestCurrentUser().then(function(user) {
            //console.log(user);
            console.log(security.currentUser);
            $scope.currentUser = user;
            console.log(user.info['uid']);
            Regroupements.get({id:user.info['uid']}, function(regroupements){
                console.log(regroupements);
                $scope.regroupements = regroupements;
            });
        });

        $scope.toTrustedHtml = function(html_code) {
            return $sce.trustAsHtml(html_code);
        };
        
        // get the list of menus
        $scope.menus = Menus;
        
        $scope.addToMessage = function(text){
            console.log('clicked');
            console.log($scope.tinyMessage);
            $scope.tinyMessage = $scope.tinyMessage + text; 
        }
        
        $scope.goToPreview = function(location){
            MessageService.addMessage($scope.tinyMessage, $scope.title)
            console.log(MessageService.getMessage());
            $location.path('/apercu/'+location);
        }
        
        $scope.goBackToMessage = function(location){
            //$scope.tinyMessage = MessageService.getMessage()['message'];
            $location.path('/message/'+location);
        }
        
        $scope.addType = function(){
            MessageService.addType('test');
        }
        
        // load message from the root ..
        $scope.tinyMessage = MessageService.getMessage()['message'];

        $scope.sendMessage = function(location){
            var message = MessageService.getMessage();
            // check if message is valid ..
            if (message.title != "" && message.message!=""){
                Publipostages.save({'descriptif': message.title, 'message': message.message, 'destinataires':message.destinations,
                    'message_type':message.messageType, 'send_type':message.sendType}, function(data){
                    $rootScope.created_publi = data;
                    // reinitialize message service
                    MessageService.init();
                    $location.path('/envoi/'+location);
                }
                    , function(error){
                        console.log(error);
                        $location.path('/error/'+error);
                        // show a message interface ..
                });
            }
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
    
}]);

/******************************************* Annonce Controller ****************************************/
Controllers.controller('AnnonceCtrl', ['$scope', 'AnnonceSquares', '$rootScope', 'Redirect', 'Menus','Faye','security', 'currentUser', '$state', 'MessageService',
    function($scope, AnnonceSquares,$rootScope, Redirect, Menus, Faye, security, currentUser, $state, MessageService){
    $scope.annonceSquares = AnnonceSquares;
    $scope.Redirect = Redirect;
    $scope.menus = Menus;
    var destinataires = MessageService.getMessage()['destinations'];
    console.log(destinataires);
    $scope.tinymceOptions = {
            language:"fr",
            theme: "modern",
            menubar:false,
            toolbar: false,
            verify_html : false,
            height : 200,
            handle_event_callback: function (e) {
            }
    };
    var personel_channel = "";
    security.requestCurrentUser().then(function(user){
        currentUser = user;
        console.log(currentUser);
        personel_channel = "/etablissement/"+(currentUser.info['uid'])+"/personnels";
        console.log(personel_channel);
    });

    $scope.sendNotification = function(message){
        switch($state.params['param']) {
            case 'ecrire_personnels':
                Faye.publish(personel_channel, {msg: message, title:'Personnels <br/><hr/>'});
                break;
            case 'ecrire_eleves':
                destinataires.forEach(function(dest, index, array){
                    if(angular.isDefined(dest['classe_id']))
                        Faye.publish(("/etablissement/"+ dest['etablissement_code']+"/classe/"+ dest['classe_id']+"/ELV"), {msg: message, title:'Message aux eleves de '+dest['classe_libelle']+'<br/><hr/>'});
                    if(angular.isDefined(dest['groupe_id']))
                        Faye.publish(("/etablissement/"+ dest['etablissement_code']+"/groupe/"+ dest['groupe_id']+"/ELV"), {msg: message, title:'Message aux eleves de '+dest['groupe_libelle']+'<br/><hr/>'});
                });
                break;
            case 'ecrire_profs':
                destinataires.forEach(function(dest, index, array){
                    if(angular.isDefined(dest['classe_id']))
                        Faye.publish(("/etablissement/"+ dest['etablissement_code']+"/classe/"+ dest['classe_id']+"/PROF_ETB"), {msg: message, title:'Message aux enseignants de '+dest['classe_libelle']+'<br/><hr/>'});
                    if(angular.isDefined(dest['groupe_id']))
                        Faye.publish(("/etablissement/"+ dest['etablissement_code']+"/groupe/"+ dest['groupe_id']+"/PROF_ETB"), {msg: message, title:'Message aux enseignants de '+dest['groupe_libelle']+'<br/><hr/>'});
                });
                break;
            case 'ecrire_parents':
                console.log('ecrire_parents');
                break;
            default:
                console.log("default");
        }
    };
}]);

/******************************************* Destinataire Controller ****************************************/
Controllers.controller('destinatairesCtrl', ['$scope', 'security','Regroupements', '$location', '$rootScope', 'Message', 'MessageService','Redirect', 
    'colors', 'transparentColors', 'Menus', '$state', function($scope,security, Regroupements, $location, $rootScope, Message, MessageService, Redirect, 
    colors, transparentColors, Menus, $state){
    // making Redirect utils accesible in the scope
    $scope.Redirect = Redirect;
    $scope.security = security;
    // if current state == destinataire
    if ($state.current.name == "destinataire") {
        MessageService.addMessageType($state.params['type']);
    }
    //initialize destinations
    $scope.destinations = [];

    // get the list of user regroupements 
    security.requestCurrentUser().then(function(user) {
        $scope.currentUser = user;
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
    };

    $scope.deselectAll = function(){
        $scope.selectAllMode = true;
        $scope.destinations = [];
        $scope.regroupements['classes'].forEach(function(element, index, array){
            if(element['checked'] || element['checked'].isUndefined){
                element['checked'] = false;
                $scope.changeClassColor(index);
            }
        });
    };

    $scope.addDestinations = function(){
        console.log('add destinations');
        MessageService.addDestinations($scope.destinations);
        console.log(MessageService.getMessage());
    };

    $scope.addRemoveDestination = function(object){
        var index = $scope.destinations.indexOf(object)
        if(index > -1){
            $scope.destinations.splice(index,1);
        }else{
            $scope.destinations.push(object);
        }
    };

    $scope.randomColor = function() {
        var index = Math.floor(Math.random()*(colors.length));
        console.log(index);
        return colors[index];
    };

    $scope.randomTransparentColor = function() {
        var index = Math.floor(Math.random()*(transparentColors.length));
        return transparentColors[index];
    };

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
    };

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
    };
    // watch destinations (array)
    $scope.$watch('destinations', function(newVal){
        console.log(newVal);
    }, true);

}]);

Controllers.controller('InfoFamilleCtrl', ['$scope', function($scope){

}]);

/********************************* Massage controller*****************************************/
Controllers.controller('MassageCtrl', ['$scope', '$sce', '$location', '$rootScope', 'MessageService','Redirect', 'Menus','tinymceOptions', '$state',
    function($scope, $sce, $location, $rootScope, MessageService, Redirect, Menus, tinymceOptions, $state){

        //$scope.tinymceOptions =  tinymceOptions;
        $scope.tinymceOptions = {
            language:"fr",
            menubar: false,
            theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
            font_size_style_values: "12px,13px,14px,16px,18px,20px",
            toolbar: "styleselect,fontsizeselect,sub,sup,|,bold,italic,underline,strikethrough,| alignleft,aligncenter,alignright | bullist,numlist",
            extended_valid_elements : "nom,civilite",
            custom_elements: "nom,civilite",
            verify_html : false,
            height : 200,
            handle_event_callback: function (e) {
                // put logic here for keypress
                console.log("callback called");
            }
        };

        // load message from the root ..
        $scope.tinyMessage = MessageService.getMessage()['message'];
        console.log('tinyMessage');
        console.log($scope.tinyMessage);

        $scope.toTrustedHtml = function(html_code) {
            return $sce.trustAsHtml(html_code);
        };
        
        // get the list of menus
        $scope.menus = Menus;
        
        $scope.addToMessage = function(text){
            console.log('add to message');
            console.log($scope.tinyMessage);
            $scope.tinyMessage = $scope.tinyMessage + text; 
        }
        
        $scope.goToPreview = function(location){
            console.log('add message to preview');
            MessageService.addMessage($scope.tinyMessage, $scope.title)
            $location.path('/apercu/'+location);
        }
        
        $scope.addType = function(){
            MessageService.addType('test');
        }
    
}]);

/******************************************* Doc Controller ****************************************/
Controllers.controller('DocCtrl', ['$scope', '$state', function($scope, $state){
    $scope.pdfUrl = 'http://localhost:9292/app/api/publipostage/'+$state.params['id']+'/pdf';
}]);
/***************************************************************************************************/

Controllers.controller('NotificationCtrl', ['$scope', '$http', 'Faye', '$rootScope', 'security','currentUser', 'Regroupements',
    function($scope, $http, Faye, $rootScope, security, currentUser, Regroupements) {
    // subscribe users to channels..
    security.requestCurrentUser().then(function(user){
        currentUser = user;
        //console.log(currentUser);
        var channels = [];
        Regroupements.get({id:user.info['uid']},function(regroupements){
            $scope.regroupements = regroupements;
            console.log(regroupements);
            console.log(currentUser);
            for(var i=0; i<currentUser.roles.length; i++){
                //moi channel
                channels.push("/etablissement/"+currentUser.roles[i][1]+"/"+currentUser.roles[i][0]+"/"+currentUser.info['uid']);
                //etablissement channels
                channels.push("/etablissement/"+currentUser.roles[i][1]+"/"+currentUser.roles[i][0]);
                $scope.regroupements['classes'].forEach(function(classe, index, array){
                    channels.push("/etablissement/"+classe['etablissement_code']+"/classe/"+classe['classe_id']+"/"+currentUser.roles[i][0]);
                });
                $scope.regroupements['groupes_eleves'].forEach(function(groupe, index, array){
                    channels.push("/etablissement/"+groupe['etablissement_code']+"/groupe/"+groupe['groupe_id']+"/"+currentUser.roles[i][0]);
                });
                var channel = "/etablissement/"+(currentUser.info['uid'])+"/personnels";
                channels.push(channel);

                // le problem et de generer plusieur subscribe automatiquement.
                $rootScope.data = [];
                var process_message = function(msg){
                    $rootScope.data.push(msg);
                    $scope.$emit('growlMessage', msg);
                };
                //subscribe to channels;
                for(var ch in channels){
                    Faye.subscribe(channels[ch], process_message);
                }
            }
        });
    });
}]);

