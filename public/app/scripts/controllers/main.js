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

Controllers.controller('HomeCtrl', ['$scope','security', 'Publipostages', 'currentUser', 'SVG_AVATAR_F', 'SVG_AVATAR_M', "$location", "$rootScope", function($scope, security, Publipostages, currentUser, SVG_AVATAR_F, SVG_AVATAR_M, $location, $rootScope) {
    $scope.tinymceOptions = {
        language:"fr"
    };
    Publipostages.all({}, function(publis){
        $scope.publis = publis
    });
    
    $scope.menus = {}; 
    $scope.menus["profs"] = [{url:"#/info_famille", text:"info_famille", icon:"icon"},
                    {url:"#/ecrire_profs", text:"écrire aux profs", icon:"icon"},
                    {url:"#/ecrire_eleves", text:"écrire aux eleves", icon:"icon"},
                    {url:"#/ecrire_tous", text:"écrire à tous", icon:"icon"},
                    {url:"#/ecrire_tous", text:"écrire à tous", icon:"icon"},
                    {url:"#/ecrire_tous", text:"écrire à tous", icon:"icon"}];
    $scope.menus["eleve"] = [{url:"#/ecrire_profs", text:"écrire aux profs", icon:"icon"},
                    {url:"#/ecrire_eleves", text:"écrire aux eleves", icon:"icon"},
                    {url:"#/ecrire_tous", text:"écrire à tous", icon:"icon"},
                    {url:"#/ecrire_tous", text:"écrire à tous", icon:"icon"},
                    {url:"#/ecrire_tous", text:"écrire à tous", icon:"icon"}];
    
    
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
                      url: '/info_famille',
                      active: false
                    },
                    { id: 'write_profs',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'vert',
                      text: 'écrire aux profs',
                      url: '',
                      active: false
                    },
                    { id: 'write_eleves',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'bleu',
                      text: 'écrire aux élèves',
                      url: '',
                      active: false
                    },
                    { id: 'write_all',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'jaune',
                      text: 'écrire à tous',
                      url: '',
                      active: false
                    },
                    { id: 'distribute_code',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'violet',
                      text: 'distribuer le code',
                      url: '',
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

Controllers.controller('MainCtrl', ['$scope', 'security','Regroupements', '$location', '$rootScope', function($scope, security, Regroupements, $location, $rootScope){
    // option tinyMce ;
    $scope.tinymceOptions = {
        language:"fr",
        menubar: false,
        theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
        font_size_style_values: "12px,13px,14px,16px,18px,20px",
        toolbar: "styleselect,fontsizeselect,sub,sup,|,bold,italic,underline,strikethrough,| alignleft,aligncenter,alignright | bullist,numlist"
    };
    
    $scope.title = "title";
    $scope.tinymceModel = "Message";
    
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
            
            //
            $scope.empty_squares = new Array(15 - ($scope.regroupements['classes'].length + $scope.regroupements['groupes_eleves'].length));
            console.log($scope.empty_squares);
            $scope.empty_squares.forEach(function(element, index, array){
                element = { color:$scope.randomColor()}
            });
            console.log($scope.empty_squares);  
            
        });
    });
    
    $scope.goTo = function(location){
        $location.path(location);
    }
    
    $scope.goToHistory=function(id){
        $location.path('/historique/'+id);    
    }
    
    
    
    $scope.colors = [ 'bleu', 'vert', 'rouge', 'violet', 'orange',
                        'jaune', 'gris1','gris2', 'gris3', 'gris4' ];
    
    
    $scope.randomColor = function() {
        var index = Math.floor(Math.random()*($scope.colors.length));
        console.log(index);
        return $scope.colors[index];
    };
    
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


