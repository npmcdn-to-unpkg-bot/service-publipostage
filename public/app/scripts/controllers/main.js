'use strict';

/* Controllers */

var Controllers  =  angular.module('myApp.controllers', []);
Controllers.controller('TestCtrl', ['$rootScope','security', 'Publipostages', 'currentUser', 'SVG_AVATAR_F', 'SVG_AVATAR_M', "$location", function($scope, security, Publipostages, currentUser, SVG_AVATAR_F, SVG_AVATAR_M, $location) {
    $scope.tinymceOptions = {
        language:"fr"
    };
    //var user = security.requestCurrentUser().then(function(user) {
    //    console.log(user);
    //});
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
    
    $scope.goTo = function(location){
        $location.path(location);
    }
    
    $scope.colors = [ 'bleu', 'vert', 'rouge', 'violet', 'orange',
                        'jaune', 'gris1','gris2', 'gris3', 'gris4' ];

    
}]);

Controllers.controller('HomeCtrl', ['$scope','security', 'Publipostages', 'currentUser', 'SVG_AVATAR_F', 'SVG_AVATAR_M', "$location", "$rootScope", "$stateParams" , function($scope, security, Publipostages, currentUser, SVG_AVATAR_F, SVG_AVATAR_M, $location, $rootScope,  $stateParams) {
    $scope.tinymceOptions = {
        language:"fr"
    };
    Publipostages.all({}, function(publis){
        $scope.publis = publis
    });
    
    $scope.squares = [ { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'bleu-clear',
                      text: '',
                      url: '',
                      active: false
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'jaune-clear',
                      text: '',
                      url: '',
                      active: false
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'violet-clear',
                      text: '',
                      url: '',
                      active: false
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'vert-clear',
                      text: '',
                      url:'' ,
                      active: false
                    },
                    { id: 'info_famille',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'rouge',
                      text: 'info famille',
                      url: '/destinataire/info_famille',
                      active: false
                    },
                    { id: 'write_profs',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'vert',
                      text: 'écrire aux profs',
                      url: '/destinataire/ecrire_profs',
                      active: false
                    },
                    { id: 'write_eleves',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'bleu',
                      text: 'écrire aux élèves',
                      url: '/type_message/ecrire_eleves',
                      active: false
                    },
                    { id: 'write_personnels',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'jaune',
                      text: 'écrire aux personnels',
                      url: '/type_message/ecrire_personnels',
                      active: false
                    },
                    { id: 'write_all',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'violet',
                      text: 'écrire à tous',
                      url: '/type_message/ecrire_personnels',
                      active: false
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'bleu',
                      text: 'faire une annonce',
                      url: '',
                      active: false
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'jaune',
                      text: 'utiliser un modèle',
                      url: '',
                      active: false
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'rouge',
                      text: 'ma messagerie',
                      url: '',
                      active: false
                    },
                    { id: 'admin',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'jaune-clear',
                      text: '',
                      url: '',
                      active: false
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'rouge-clear',
                      text: '',
                      url: '',
                      active: true
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'vert-clear',
                      text: '',
                      url: '',
                      active: true
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'bleu-clear',
                      text: '',
                      url: '',
                      active: true
                    }
                  ];
    
    //$scope.menus = { "prof" : ["info_famille", "écrire aux profs", "écrire aux eleves"
    //                           , "écrire à tous", "faire une annonce", "utiliser un modèle", "ma messagerie"],
    //                "eleve" : ["écrire aux eleves","faire une annonce", "utiliser un modèle", "ma messagerie"],
    //                "parent":["info_famille", "écrire aux profs", "écrire aux eleves"
    //                           , "écrire à tous", "faire une annonce", "utiliser un modèle", "ma messagerie"],
    //                "admin":["info_famille", "écrire aux profs", "écrire aux eleves"
    //                           , "écrire à tous", "faire une annonce", "utiliser un modèle", "ma messagerie"],
    //                "admin_etab":["info_famille", "écrire aux profs", "écrire aux eleves"
    //                           , "écrire à tous", "faire une annonce", "utiliser un modèle", "ma messagerie"],
    //                };
    
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
}]);

Controllers.controller('MyCtrl2', [function() {

}]);

Controllers.controller('wizardController', ['$scope', function($scope){
    $scope.log = function(event){
        console.log(event);
    }
    $scope.user = {};
    $scope.etablissements = [];
}]);

Controllers.controller('MainCtrl', ['$scope', '$sce', 'security','Regroupements', '$location', '$rootScope', 'Message', function($scope, $sce, security, Regroupements, $location, $rootScope, Message){
    // option tinyMce ;
    $scope.tinymceOptions = {
        language:"fr",
        menubar: false,
        theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
        font_size_style_values: "12px,13px,14px,16px,18px,20px",
        toolbar: "styleselect,fontsizeselect,sub,sup,|,bold,italic,underline,strikethrough,| alignleft,aligncenter,alignright | bullist,numlist"
    };
    
    security.requestCurrentUser().then(function(user) {
        //console.log(user);
        $scope.currentUser = user;
        console.log(user.info['uid']);
        Regroupements.get({id:user.info['uid']}, function(regroupements){
            console.log(regroupements);
            $scope.regroupements = regroupements;
            // add colors to classes
            $scope.regroupements['classes'].forEach(function(element, index, array){
                element['color'] = $scope.randomColor();
            });
            
            // add colors to groupes
            $scope.regroupements['groupes_eleves'].forEach(function(element, index, array){
                element['color'] = $scope.randomColor();
            });
            
            // Add colors to empty squres
            $scope.empty_squares = new Array(15 - ($scope.regroupements['classes'].length + $scope.regroupements['groupes_eleves'].length));
            console.log($scope.empty_squares);
            for (var i=0;i<$scope.empty_squares.length;i++){
                $scope.empty_squares[i]={ color:$scope.randomTransparentColor()};
            }    
            console.log($scope.empty_squares);  
            
        });
    });
    
    $scope.menus = {
        info_famille: {
            left_menu_text:'info famille : pour diffuser un message aux famille d\'élèves',
            left_menu_button_text: 'écrire une nouvelle info famille',
            right_menu_text: 'info famille',
            recpitualif:'familles de'
        },
        ecrire_profs:{
            left_menu_text:'écrire aux prof : pour diffuser un message aux enseignants',
            left_menu_button_text: 'écrire aux enseignant',
            right_menu_text: 'écrire aux prof',
            recpitualif:'profs de'
        }
    };  
    
    $scope.goTo = function(location){
        $location.path(location);
    }
    
    $scope.goToDestinataire = function(service){
 
        $location.path('/destinataire/'+ service);
    }
    
    $scope.goToMessage = function(service){
        $location.path('/message/'+ service);
    }
    
    $scope.goToHistory = function(id){
        $location.path('/historique/'+id);    
    }
    
    $scope.addToMessage = function(text){
        $scope.tinyMessage = $scope.tinyMessage + text;
    }
    
    $scope.goToPreview = function(){
        Message.add($scope.tinyMessage);
        $location.path('/apercu');
    }
    
    $scope.goBackToMessage = function(){
        console.log(Message.get());
        $scope.tinyMessage = Message.get();
        $location.path('/message/info_famille');
    }
    // load message from the root ..
    $scope.tinyMessage = Message.get();
    
    $scope.colors = [ 'bleu', 'vert', 'rouge', 'violet', 'orange',
                        'jaune', 'gris1','gris2', 'gris3', 'gris4' ];
    
    $scope.transparentColors = [ 'bleu-clear', 'vert-clear', 'rouge-clear', 'violet-clear', 'orange-clear',
                        'jaune-clear', 'gris1-clear','gris2-clear', 'gris3-clear', 'gris4-clear' ];
    
    
    $scope.randomColor = function() {
        var index = Math.floor(Math.random()*($scope.colors.length));
        console.log(index);
        return $scope.colors[index];
    };
    
    $scope.randomTransparentColor = function() {
        var index = Math.floor(Math.random()*($scope.transparentColors.length));
        console.log(index);
        return $scope.transparentColors[index];
    };
    
    
    $scope.toTrustedHtml = function(html_code) {
        return $sce.trustAsHtml(html_code);
    }

    
    $scope.changeClassColor = function($index){
        var color = $scope.regroupements['classes'][$index]['color']; 
        console.log(color);
        var match = color.search("-clear");
        if (match==-1) {
            color = color+"-clear";
        }else
        {
            color = color.substr(0,match)
        }
        
        $scope.regroupements['classes'][$index]['color']=color;
        console.log('new color', color);
        
    }
    //$scope.randomColor = 'bleu';
    
    
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
    $scope.squares = [{ id: '',
                      icone: $rootScope.racine_images + '00_vide.svg',
                      couleur: 'rouge',
                      nom: '',
                      lien: '',
                      active: false
                    }, 
                      { id: '',
                      icone: $rootScope.racine_images + '00_vide.svg',
                      couleur: 'bleu',
                      nom: '',
                      lien: '',
                      active: false
                    },
                    { id: '',
                      icone: $rootScope.racine_images + '00_vide.svg',
                      couleur: 'jaune',
                      nom: '',
                      lien: '',
                      active: false
                    },
                    { id: '',
                      icone: $rootScope.racine_images + '00_vide.svg',
                      couleur: 'violet',
                      nom: '',
                      lien: '',
                      active: false
                    }];
    
}]);

Controllers.controller('InfoFamilleCtrl', ['$scope', function($scope){

}]); 


