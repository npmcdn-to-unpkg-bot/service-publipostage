'use strict';

/* Controllers */

var Controllers  =  angular.module('myApp.controllers', []);

Controllers.controller('publiCtrl', ['$rootScope', '$sce', 'security', 'Publipostages', 'currentUser', 'SVG_AVATAR_F', 'SVG_AVATAR_M', "$location", function($scope, $sce, security, Publipostages, currentUser, SVG_AVATAR_F, SVG_AVATAR_M, $location) {
    $scope.tinymceOptions = {
        language:"fr"
    };
    $scope.pageLimits = [5, 10, 20]; 
    $scope.limit = 5;
    $scope.currentPage = 1;
    $scope.maxSize = 5;

    $scope.checked = {};
    $scope.check_all = false;
    var getPublipostages = function(page, limit){
        Publipostages.get({limit:limit, page:page}, function(publis){
        $scope.publis = publis.data;
        $scope.totalItems = publis.total;
        $scope.currentPage = publis.page;
        });
    }
    getPublipostages($scope.currentPage, $scope.limit);
    
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
                getPublipostages($scope.currentPage, $scope.limit);
            }, function(error){
                console.log(error);
            });
        }
    }
    $scope.pageChanged = function(newValue) {
        getPublipostages(newValue, $scope.limit);
    };

    $scope.limitChanged = function(newValue){
        $scope.limit = newValue;
        $scope.currentPage = 1;
        getPublipostages($scope.currentPage, newValue);
    };

    $scope.selectAll = function(){
        $scope.check_all = !$scope.check_all;
        angular.forEach($scope.publis, function(publi){
            $scope.checked[publi.id] = !$scope.checked[publi.id];
        });
    };

    $scope.selectPubli = function(id){
        console.log(id);
        //$scope.checked[id] = !$scope.checked[id];
    };

    $scope.removeSelectedPubli = function(){
        if(confirm("Voulez-vous supprimer les publipostages sélectionnés?")){
            Publipostages.remove({id:angular.toJson($scope.checked)}, 
                function(success){
                    $scope.check_all = false;
                    getPublipostages($scope.currentPage, $scope.limit);
                }, function(error){
                    console.log(error);
            });
        }
    };

    $scope.$watch('checked', function(newValue){console.log(newValue);}, true);

}]);
/********************************* Home page controller  *****************************************/
Controllers.controller('HomeCtrl', ['$scope','security', 'Publipostages', 'currentUser', 'SVG_AVATAR_F', 'SVG_AVATAR_M', "$location", "$rootScope", "$stateParams", "MessageService", 'Redirect','Squares',
    function($scope, security, Publipostages, currentUser, SVG_AVATAR_F, SVG_AVATAR_M, $location, $rootScope,  $stateParams, MessageService, Redirect, Squares) {
        $scope.Redirect = Redirect;   
        
        $scope.tinymceOptions = {
            language:"fr"
        };

        $scope.security = security;

        Publipostages.get({}, function(publis){
            $scope.publis = publis.data
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
    'colors', 'transparentColors', 'Menus','tinymceOptions', '$state', 'Publipostages', 'Emails',
    function($scope, $sce, security, Regroupements, $location, $rootScope, Message, MessageService, Redirect,
     colors, transparentColors, Menus, tinymceOptions, $state, Publipostages, Emails){
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
                    'message_type':message.messageType, 'send_type':message.sendType, 'profils':message.profils}, function(data){
                        $rootScope.created_publi = data;
                        // reinitialize message service
                        MessageService.init();
                        $location.path('/envoi/'+location);
                    }, 
                    function(error){
                        console.log(error);
                        $location.path('/error/'+error['data'].error);
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

        // Specifique à la page mode de diffusion
        if($location.$$path.indexOf('/mode_diffusion/') == 0) {

          $scope.nb_email = '?';
          $scope.nb_pdf = '?';

          if($location.$$path.indexOf('/mode_diffusion/ecrire_personnels') == 0) {
            var count = 0;
            _.each($rootScope.messageObject['destinations'], function(el) {
              count += el.emails.length;
            });
            $scope.nb_email = count;
          }
          else {
            var regroupements = '';
            _.each($rootScope.messageObject['destinations'], function(el) {
                if(!_.isUndefined(el.classe_id)) {
                  regroupements += el.classe_id + ";";
                }
                else if(!_.isUndefined(el.groupe_id)) {
                 regroupements += el.groupe_id + ";";   
                }
            });
            if(regroupements != '') {
              //Cas des élèves
              if($location.$$path.indexOf('/mode_diffusion/ecrire_eleves') == 0) {
                Emails.listStudents({regroupements : regroupements},function(data) {
                  $scope.nb_email = data.length;
                });
              }
              else if($location.$$path.indexOf('/mode_diffusion/ecrire_profs') == 0) {
                Emails.listProfessors({regroupements : regroupements},function(data) {
                  $scope.nb_email = data.length;
                });
              }
              else if($location.$$path.indexOf('/mode_diffusion/info_famille') == 0) {
                Emails.listFamilly({regroupements : regroupements},function(data) {
                  $scope.nb_email = data.length;
                });
              }
            }
          }
        }
}]);

/******************************************* Annonce Controller ****************************************/
Controllers.controller('AnnonceCtrl', ['$scope', 'AnnonceSquares', '$rootScope', 'Redirect', 'Menus','Faye','security', 'currentUser', '$state', 'MessageService', '$filter',
    function($scope, AnnonceSquares,$rootScope, Redirect, Menus, Faye, security, currentUser, $state, MessageService, $filter){
    $scope.annonceSquares = AnnonceSquares;
    $scope.Redirect = Redirect;
    $scope.menus = Menus;
    $scope.notification = 'Ecrire une annonce de 300 caractères maximum.';
    var destinataires = MessageService.getMessage()['destinations'];
    console.log(destinataires);
    // list of available profils 
    //$scope.profils = ['eleves', 'profs', 'parents'];
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
    var profils = MessageService.getMessage()['profils'];
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
                Faye.publish(personel_channel,
                    {
                        msg: message,
                        title:'Personnels <br/><hr/>',
                        from:currentUser.info['LaclasseCivilite'] +' '+ currentUser.info["LaclasseNom"],
                        at: $filter('date')(new Date(), 'yyyy-MM-dd à HH:mm:ss')
                    });
                break;
            case 'ecrire_eleves':
               ecrireEleves(message);
                break;
            case 'ecrire_profs':
                ecrireProfs(message);
                break;
            case 'ecrire_parents':
                ecrireParents(message);
                break;
            case 'ecrire_tous':
                console.log($scope.selectedProfils);
                angular.forEach(profils, function(profil){
                    switch(profil){
                        case 'eleves':
                            ecrireEleves(message);
                            break;
                        case 'profs':
                            ecrireProfs(message);
                            break;
                        case 'parents':
                            ecrireParents(message);
                            break;
                        default:
                            console.log("default");
                    }
                });
                break;
            default:
                console.log("default");
        }
    };

    var ecrireEleves = function(message){
        destinataires.forEach(function(dest, index, array){
            if(angular.isDefined(dest['classe_id']))
                Faye.publish(("/etablissement/"+ dest['etablissement_code']+"/classe/"+ dest['classe_id']+"/ELV_ETB"),
                    {
                        msg: message,
                        title:'Message aux eleves de '+dest['classe_libelle']+'<br/><hr/>',
                        from:currentUser.info['LaclasseCivilite'] +' '+ currentUser.info["LaclasseNom"],
                        at: $filter('date')(new Date(), 'yyyy-MM-dd à HH:mm:ss')
                    });
            if(angular.isDefined(dest['groupe_id']))
                Faye.publish(("/etablissement/"+ dest['etablissement_code']+"/groupe/"+ dest['groupe_id']+"/ELV_ETB"),
                    {
                        msg: message,
                        title:'Message aux eleves de '+dest['groupe_libelle']+'<br/><hr/>',
                        from:currentUser.info['LaclasseCivilite'] +' '+ currentUser.info["LaclasseNom"],
                        at: $filter('date')(new Date(), 'yyyy-MM-dd à HH:mm:ss')
                    });
        });
    };

    var ecrireProfs = function(message){
        destinataires.forEach(function(dest, index, array){
            if(angular.isDefined(dest['classe_id']))
                Faye.publish(("/etablissement/"+ dest['etablissement_code']+"/classe/"+ dest['classe_id']+"/PROF_ETB"),
                    {   msg: message,
                        title:'Message aux enseignants de '+dest['classe_libelle']+'<br/><hr/>',
                        from: currentUser.info['LaclasseCivilite'] +' '+ currentUser.info["LaclasseNom"],
                        at: ''+ $filter('date')(new Date(), 'yyyy-MM-dd  à HH:mm:ss')
                    });
            if(angular.isDefined(dest['groupe_id']))
                Faye.publish(("/etablissement/"+ dest['etablissement_code']+"/groupe/"+ dest['groupe_id']+"/PROF_ETB"),
                    {
                        msg: message,
                        title:'Message aux enseignants de '+dest['groupe_libelle']+'<br/><hr/>',
                        from: currentUser.info['LaclasseCivilite'] +' '+ currentUser.info["LaclasseNom"],
                        at: ''+$filter('date')(new Date(), 'yyyy-MM-dd à HH:mm:ss')
                    });
        });
    };

    var ecrireParents = function(message){
        destinataires.forEach(function(dest, index, array){
            if(angular.isDefined(dest['classe_id']))
                Faye.publish(("/etablissement/"+ dest['etablissement_code']+"/classe/"+ dest['classe_id']+"/PAR_ETB"),
                    {
                        msg: message,
                        title:'Message aux parents de '+dest['classe_libelle']+'<br/><hr/>',
                        from: currentUser.info['LaclasseCivilite'] +' '+ currentUser.info["LaclasseNom"],
                        at: ''+$filter('date')(new Date(), 'yyyy-MM-dd à HH:mm:ss')
                    });
            if(angular.isDefined(dest['groupe_id']))
                Faye.publish(("/etablissement/"+ dest['etablissement_code']+"/groupe/"+ dest['groupe_id']+"/PAR_ETB"),
                    {
                        msg: message,
                        title:'Message aux parents de '+dest['groupe_libelle']+'<br/><hr/>',
                        from: currentUser.info['LaclasseCivilite'] +' '+ currentUser.info["LaclasseNom"],
                        at: ''+$filter('date')(new Date(), 'yyyy-MM-dd à HH:mm:ss')
                    });
        });
    };

}]);

/******************************************* Destinataire Controller ****************************************/
Controllers.controller('destinatairesCtrl', ['$scope', 'security','Regroupements', '$location', '$rootScope', 'Message', 'MessageService','Redirect', 
    'colors', 'transparentColors', 'Menus', '$state', 'Personnels', function($scope,security, Regroupements, $location, $rootScope, Message, MessageService, Redirect, 
    colors, transparentColors, Menus, $state, Personnels){
    // making Redirect utils accesible in the scope
    $scope.Redirect = Redirect;
    $scope.security = security;
    // if current state == destinataire
    if ($state.current.name == "destinataire") {
        MessageService.addMessageType($state.params['type']);
    }
    //initialize destinations
    $scope.destinations = [];

    var getPersonnel = function(uai){
        Personnels.all({uai:uai}, function(personnels){
            $scope.personnels = personnels;
            console.log(personnels);
        }, function(error){
            console.log(error);
        });
    };

    // get the list of user regroupements 
    security.requestCurrentUser().then(function(user) {
        $scope.currentUser = user;
        if ($state.params['type']=='ecrire_personnels')
            getPersonnel($scope.currentUser.info['ENTPersonStructRattachRNE']);
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
        $scope.regroupements['groupes_eleves'].forEach(function(element, index, array){
            if (!element['checked'] || element['checked'].isUndefined){
                element['checked'] = true;
                $scope.destinations.push(element);
                $scope.changeGroupColor(index);
            }
        })

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
        $scope.regroupements['groupes_eleves'].forEach(function(element, index, array){
            if(element['checked'] || element['checked'].isUndefined){
                element['checked'] = false;
                $scope.changeGroupColor(index);
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

    $scope.addProfils = function(){
        console.log('add profils');
        MessageService.addProfils($scope.selectedProfils);
        console.log(MessageService.getMessage());
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
    /*
    $scope.$watch('destinations', function(newVal){
        console.log(newVal);
    }, true); 
    */

    // page ecrire tous
    // list of available profils 
    $scope.profils = ['eleves', 'profs', 'parents'];

    // les profils sélectionner
    $scope.selectedProfils = [];
    $scope.log = function(){
        console.log($scope.selectedProfils);
    }

    // selectionner tous les profils
    $scope.checkAll = function(){
        $scope.selectedProfils = [];
        $scope.selectedProfils = angular.copy($scope.profils);
    }

    // déselectionner les profils
    $scope.uncheckAll = function(){
        $scope.selectedProfils = [];
    };

    $scope.$watch("selectedProfils", function(arr){
        console.log(arr);
    }, true);

    $scope.noSelection = function(){
        if ($state.params['type']=='ecrire_tous')
            return $scope.destinations.length == 0 || $scope.selectedProfils.length == 0;
        else
            return $scope.destinations.length == 0; 
    }

}]);

Controllers.controller('InfoFamilleCtrl', ['$scope', function($scope){

}]);

/********************************* Massage controller*****************************************/
Controllers.controller('MassageCtrl', ['$scope', '$sce', '$location', '$rootScope', 'MessageService','Redirect', 'Menus','tinymceOptions', '$state',
    function($scope, $sce, $location, $rootScope, MessageService, Redirect, Menus, tinymceOptions, $state){
        //$scope.tinymceOptions =  tinymceOptions;
        $scope.tinymceOptions = {
            // Test to place lang elsewhere and have it bower compliant
            language:"../../../scripts/externals/tinymce/lang/fr",
            menubar: false,
            theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
            font_size_style_values: "12px,13px,14px,16px,18px,20px",
            toolbar: "styleselect,fontsizeselect,sub,sup,|,bold,italic,underline,strikethrough,| alignleft,aligncenter,alignright | bullist,numlist",
            extended_valid_elements : "nom,civilite",
            //custom_elements: "nom,civilite",
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
/* listen to notification Controller */
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
            //construct listen channels
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

