'use strict';

/* Controllers */

var Controllers  =  angular.module('myApp.controllers', []);

Controllers.controller('publiCtrl', ['$rootScope', '$sce', 'security', 'Publipostages', 'currentUser', 'SVG_AVATAR_F', 'SVG_AVATAR_M', "$location", 'tinymceOptions',
     function($scope, $sce, security, Publipostages, currentUser, SVG_AVATAR_F, SVG_AVATAR_M, $location , tinymceOptions) {
    $scope.tinymceOptions = tinymceOptions;
    
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

    $scope.duplicPubli = function (id) {
      alert('Duplication pas encore active');
    }
    
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
Controllers.controller('MainCtrl', ['$scope', '$sce', 'security','Regroupements', '$location', '$rootScope', 'MessageService','Redirect', 
    'colors', 'Menus','tinymceOptions', '$state', 'Publipostages', 'DiffusionInfo', 
    function($scope, $sce, security, Regroupements, $location, $rootScope, MessageService, Redirect,
     colors, Menus, tinymceOptions, $state, Publipostages, DiffusionInfo){
        // making Redirect utils accesible in the scope
        $scope.Redirect = Redirect;
        $scope.security = security;

        // editor tinyMce  options;
        $scope.tinymceOptions =  tinymceOptions;
        
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
                    'message_type':message.messageType, 'diffusion_type':message.diffusion_type, 'profils':message.profils}, function(data){
                        $rootScope.created_publi = data;
                        // reinitialize message service
                        MessageService.reset();
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
        
        $scope.$watch("diffusion_type", function(newVal) {
            if (angular.isUndefined(newVal) || newVal == null) return;
            MessageService.setDiffusionType(newVal);
        });
        
        $scope.resetDiffusionCounter = function() {
          $rootScope.diffusionInfo = {
            nb_email : '?',
            nb_pdf : '?',
            nb_total : '?'
          }
        }

        $scope.addDiffusionData = function(data) {
          var diffusionInfo = $rootScope.diffusionInfo;

          if(diffusionInfo.nb_email == '?') diffusionInfo.nb_email = 0;
          if(diffusionInfo.nb_pdf == '?') diffusionInfo.nb_pdf = 0;
          if(diffusionInfo.nb_total == '?') diffusionInfo.nb_total = 0;

          diffusionInfo.nb_email += data.with_email;
          diffusionInfo.nb_pdf += data.without_email;
          diffusionInfo.nb_total += data.with_email + data.without_email;

          $rootScope.diffusionInfo = diffusionInfo;
        }

        // Specifique à la page mode de diffusion
        if($location.$$path.indexOf('/mode_diffusion/') == 0) {

          $scope.resetDiffusionCounter();
          
          if($location.$$path.indexOf('/mode_diffusion/ecrire_personnels') == 0) {
            var data  = {with_email:0, without_email:0};
            _.each($rootScope.messageObject['destinations'], function(el) {
              if(_.isEmpty(el.email_principal)) {
                data.without_email += 1;
              } else {
                data.with_email += 1;
              }
            });
            $scope.addDiffusionData(data);
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
                DiffusionInfo.listStudents({regroupements : regroupements},function(data) {
                  $scope.addDiffusionData(data);
                });
              }
              else if($location.$$path.indexOf('/mode_diffusion/ecrire_profs') == 0) {
                DiffusionInfo.listProfessors({regroupements : regroupements},function(data) {
                  $scope.addDiffusionData(data);
                });
              }
              else if($location.$$path.indexOf('/mode_diffusion/info_famille') == 0) {
                DiffusionInfo.listFamilly({regroupements : regroupements},function(data) {
                  $scope.addDiffusionData(data);
                });
              }
              else if($location.$$path.indexOf('/mode_diffusion/ecrire_tous') == 0) {
                var profiles = $rootScope.messageObject['profils'];
                if(_.contains(profiles, "parents")) {
                  DiffusionInfo.listFamilly({regroupements : regroupements},function(data) {
                    $scope.addDiffusionData(data);
                  });
                }
                if(_.contains(profiles, "profs")) {
                  DiffusionInfo.listProfessors({regroupements : regroupements},function(data) {
                    $scope.addDiffusionData(data);
                  });
                }
                if(_.contains(profiles, "eleves")) {
                  DiffusionInfo.listStudents({regroupements : regroupements},function(data) {
                    $scope.addDiffusionData(data);
                  });
                }
              }
            }
          }
        }
}]);

/******************************************* Destinataire Controller ****************************************/
Controllers.controller('destinatairesCtrl', ['$scope', 'security','Regroupements', '$location', '$rootScope', 'MessageService','Redirect', 
    'colors', 'Menus', '$state', 'Personnels', 'Matieres', function($scope,security, Regroupements, $location, $rootScope, MessageService, Redirect, 
    colors, Menus, $state, Personnels, Matieres){
    // making Redirect utils accesible in the scope
    $scope.Redirect = Redirect;
    $scope.security = security;
    // if current state == destinataire
    if ($state.current.name == "destinataire") {
        MessageService.addMessageType($state.params['type']);
    }
    //initialize destinations
    $scope.destinations = new Array();

    var getPersonnel = function(uai){
        Personnels.all({uai:uai}, function(personnels){
            $scope.personnels = personnels;
            var selectdestinationsIds = new Array();
            _.each(MessageService.getMessage().destinations, function(dest) {
              selectdestinationsIds.push(dest.id);
            });
            _.each($scope.personnels, function(element) {
              if(_.contains(selectdestinationsIds, element.id)) {
                element['checked'] = true;
                $scope.destinations.push(element);
              }
            });
        }, function(error){
            console.log(error);
        });
    };

    // get the list of user regroupements 
    security.requestCurrentUser().then(function(user) {
        $scope.currentUser = user;
        if ($state.params['type']=='ecrire_personnels') {
          getPersonnel($scope.currentUser.info['ENTPersonStructRattachRNE']);
        } else {

          if($state.params['type']=='ecrire_profs') {
            Matieres.all({uai:$scope.currentUser.info['ENTPersonStructRattachRNE']}, function(matieres){
              $scope.matieres = matieres;
            });
          }

          Regroupements.get({id:user.info['uid']}, function(regroupements){
            var selectdestinationsIds = new Array();
            _.each(MessageService.getMessage().destinations, function(dest) {
              selectdestinationsIds.push(dest.id);
            });

            $scope.regroupements = regroupements;
            // add colors to classes
            var colorIndex = 0;
            $scope.regroupements['regroupements'].forEach(function(element, index, array){
                element['color'] = colors[colorIndex++%colors.length];
                if(_.contains(selectdestinationsIds, element.id)) {
                    element['checked'] = true;
                    $scope.destinations.push(element);
                }
            });
            // Add colors to empty squres
            if ($scope.regroupements['regroupements'].length < 15) {
                $scope.empty_squares = new Array(15 - $scope.regroupements['regroupements'].length );
                console.log($scope.empty_squares);
                for (var i=0;i<$scope.empty_squares.length;i++){
                  $scope.empty_squares[i]={ color:colors[colorIndex++%colors.length] , };
                }
            } else
            {
                $scope.empty_squares = []
            }
          });
        }
    });
    // get the list of menus
    $scope.menus = Menus;
    
    /* select all functionality */
    $scope.selectAllMode = true;
    
    $scope.selectAll = function(){
        $scope.selectAllMode = false;
        if($scope.regroupements != undefined && $scope.regroupements['regroupements'] != undefined) {
          $scope.regroupements['regroupements'].forEach(function(element, index, array){
            if (!element['checked'] || _.isUndefined(element['checked'])){
              element['checked'] = true;
              $scope.destinations.push(element);
            }
          });
        }
    };

    $scope.deselectAll = function(){
        $scope.selectAllMode = true;
        $scope.destinations = [];
        if($scope.regroupements != undefined && $scope.regroupements['regroupements'] != undefined) {
          $scope.regroupements['regroupements'].forEach(function(element, index, array){
            if(element['checked'] || _.isUndefined(element['checked'])){
              element['checked'] = false;
            }
          });
        }
    };

    $scope.addDestinations = function(){
        console.log('add destinations ');
        console.debug($scope.matiere);
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
    };

    $scope.squareClass = function(clazz) {
        return clazz.color + (clazz.checked ? '' : '-clear');
    }

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
Controllers.controller('MassageCtrl', ['$scope', '$sce', '$location', '$rootScope', 'MessageService','Redirect', 'Menus','tinymceOptions', '$state', 'templateItems',
    function($scope, $sce, $location, $rootScope, MessageService, Redirect, Menus, tinymceOptions, $state, templateItems){

        //Template items
        $scope.templateItems =  templateItems;

        // load message from the root ..
        $scope.tinyMessage = MessageService.getMessage()['message'];
        $scope.tinymceOptions =  tinymceOptions;

        $scope.toTrustedHtml = function(html_code) {
            return $sce.trustAsHtml(html_code);
        };
        
        // get the list of menus
        $scope.menus = Menus;
        
        $scope.addToMessage = function(text){
            console.log('add to message + ###' + text + '###');
            console.log($scope.tinyMessage);
            $scope.tinyMessage += text;
        }
        
        $scope.goToPreview = function(location){
            console.log('add message to preview');
            MessageService.addMessage($scope.tinyMessage, $scope.title)
            $location.path('/apercu/'+location);
        }

        $scope.goToDestinataire = function(location){
            $location.path('/destinataire/'+location);
        }
        
        $scope.addType = function(){
            MessageService.addType('test');
        }
    
}]);

/******************************************* Doc Controller ****************************************/
Controllers.controller('DocCtrl', ['$scope', '$state', function($scope, $state){
    
    $scope.pdfUrl = 'http://localhost:9292/app/api/publipostage/'+$state.params['id']+'/pdf';
}]);

/********************************* Controller for envoi page  *****************************************/
Controllers.controller('EnvoiCtrl', ['$scope', '$sce', 'security', '$location', '$rootScope', 'MessageService', '$state', 'Menus',
  function($scope, $sce, security, $location, $rootScope, MessageService, $state, Menus){

    // get the list of menus
    $scope.menus = Menus;
    console.debug($scope.menus);

    // Set counter and displayRules 
    var diffusionInfo = $rootScope.diffusionInfo;

    switch($rootScope.created_publi.diffusion_type) {
      case 'email' : 
        $scope.showEmail = true;
        $scope.nb_email = diffusionInfo.nb_email;
        
        if(diffusionInfo.nb_pdf > 0){
          $scope.showPdf = true;
        } else {
          $scope.showPdf = false;
        }
        $scope.nb_pdf = diffusionInfo.nb_pdf;
        break;
      case 'pdf' : 
        $scope.showEmail = false;
        $scope.showPdf = true;
        $scope.nb_pdf = diffusionInfo.nb_total;
        break;
    }
  }
]);

