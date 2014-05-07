'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.controllers', 'ngRoute', 'ui.router','services.constants', 'ui.bootstrap',
                         'ui.tinymce', 'services.messages', 'services.authentication', 'angular-underscore',
                         'underscore.string', 'wizardDirective', 'ui.select2', 'services.resources', 'ngSanitize', 'faye', 'services.utils', 
                         'pdf', 'chieffancypants.loadingBar', 'myApp.directives']).
config(['$urlRouterProvider' , '$stateProvider', 'APPLICATION_PREFIX', function($urlRouterProvider, $stateProvider, APPLICATION_PREFIX){
            
    /* defining states for routing */
    var home = {
      name: 'home',
      url: '/',
      templateUrl: APPLICATION_PREFIX+'/views/home.html',
      controller: 'HomeCtrl',
      authorizedRoles: "all"
    };
    
    var gestion = {
      name: 'gestion',
      url: '/publi',
      templateUrl: APPLICATION_PREFIX+ '/views/liste.html', 
      controller:  'publiCtrl',
      authorizedRoles: ["TECH"]
    }
    
    var createPublipostage = {
      name:'create',
      url: '/creer', 
      templateUrl: APPLICATION_PREFIX+'/views/create_publipostage.html',
      controller: 'MainCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"]
    }
    
    var profil = {
      name:'profil',
      url:'/profil',
      templateUrl: APPLICATION_PREFIX+'/views/profil.html',
      controller:'publiCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"]
    }
    
    var type_message = {  
      name:'type_message',
      url:'/type_message/:type',
      templateUrl: APPLICATION_PREFIX+'/views/type_message.html',
      controller:'MainCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"]
    }
    
    var historique = {
      name:'histroique',
      url:'/historique/:id',
      templateUrl: APPLICATION_PREFIX+'/views/historique.html',
      controller:'publiCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"]
    }
    
    var destinataire = {
      name:'destinataire',
      url:'/destinataire/:type',
      templateUrl: APPLICATION_PREFIX+'/views/destinataire.html',
      controller:'destinatairesCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"],
      resolve :{
        checkMessage: function($q, $timeout, MessageService){
          var deferred = $q.defer();
          if (!MessageService.isValid('destinataire'))
            deferred.reject("invalid message");
          else
            deferred.resolve("valid message");
          return deferred.promise;
        }
      }
    }
    
    var message = {
      name:'message',
      url:'/message/:type',
      templateUrl: APPLICATION_PREFIX+'/views/message.html',
      controller:'MassageCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"],
      resolve :{
        checkMessage: function($q, $timeout, MessageService){
          var deferred = $q.defer();
          if (!MessageService.isValid('message'))
            deferred.reject("invalid message");
          else
          deferred.resolve("valid message");
          return deferred.promise;
        }
      }
    }
    
    var apercu = {
      name:'apercu',
      url:'/apercu/:type',
      templateUrl: APPLICATION_PREFIX+'/views/apercu.html',
      controller:'MainCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"],
      resolve:{ /*
        checkMessage: function($q, $timeout, MessageService){
          var message = MessageService.getMessage();
          var d = $q.defer();
          if (!MessageService.isValid('message'))
            deferred.reject("invalid message");
          else
          deferred.resolve("valid message");
          return deferred.promise;
        } */
      }
    }
    
    var mode_diffusion = {
      name: 'mode_diffusion',
      url:'/mode_diffusion/:type',
      templateUrl: APPLICATION_PREFIX+'/views/mode_diffusion.html',
      controller:'MainCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"],
      resolve :{ /*
        checkMessage: function($q, $timeout, MessageService){
          var message = MessageService.getMessage();
          var deferred = $q.defer();
          if (message['messageType']==""|| message['destinations'].length==0 || message['message'] =="")
            deferred.reject("invalid message");
          else
            deferred.resolve("valid message");
          return deferred.promise;

        } */ 
      }
    }
    
    var envoi = {
      name:'envoi',
      url:'/envoi/:type',
      templateUrl: APPLICATION_PREFIX+'/views/envoi.html',
      controller:'MainCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"]
    }

    var annonce = {
      name:'annonce',
      url:'/annonce',
      templateUrl:APPLICATION_PREFIX+'/views/annonce.html',
      controller:'AnnonceCtrl',
      authorizedRoles: ["TECH", "PROF_ETB", "ADM_ETB"]
    }

    var annonce_destinataires = {
      name:'annonce_destinataires',
      url:'/annonce_destinataires/:annonce_type',
      templateUrl: APPLICATION_PREFIX+'/views/annonce_destinataires.html',
      controller:'destinatairesCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"],
    }

    var annonce_for = {
      name:'annonce_for',
      url:'/annonce/:param',
      controller:'AnnonceCtrl',
      templateUrl:APPLICATION_PREFIX+'/views/annonce_pour.html',
      authorizedRoles: ["TECH","ADM_ETB","PROF_ETB"]
    }

    var fichier = {
      name:'fichier',
      url:'/fichier/:id',
      templateUrl:APPLICATION_PREFIX+'/views/pdfviewer.html',
      controller: 'DocCtrl',
      authorizedRoles: "all"
    }

    var error = {
      name:'error',
      url:'/error/:message',
      template: '<p> une erreur sest produite </p>',
      authorizedRoles: "all"
    }

    var envoi_annonce = {
      name:'envoi_annonce',
      url:'/envoi_annonce/:type',
      templateUrl: APPLICATION_PREFIX+'/views/envoi_annonce.html',
      controller:'AnnonceCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"]
    }

    
    $stateProvider.state(home)
    .state(gestion)
    .state(createPublipostage)
    .state(profil)
    .state(type_message)
    .state(historique)
    .state(destinataire)
    .state(message)
    .state(apercu)
    .state(mode_diffusion)
    .state(envoi)
    .state(annonce_for)
    .state(annonce)
    .state(annonce_destinataires)
    .state(error)
    .state(fichier)
    .state(envoi_annonce);
    $urlRouterProvider.otherwise('/');
    
}]).config(function ($provide, $httpProvider) {
    // Intercept http calls.
    $provide.factory('HttpInterceptor', function ($q, $location) {
        return {
          // On request success
          request: function (config) {
            // Return the config or wrap it in a promise if blank.
            return config || $q.when(config);
          },
          // On request failure
          requestError: function (rejection) {
            // Return the promise rejection.
            return $q.reject(rejection);
          },
          // On response success
          response: function (response) {
            // Return the response or promise.
            return response || $q.when(response);
          },
          // On response failture
          responseError: function (rejection) {
            if (rejection.status == 0 ) {
                  $location.path('/');
                  //FlashServiceStyled.show("vous n\'êtes pas authorizé à faire cette action", "alert alert-error");
            }
            if (rejection.status== 403 || rejection.status == 401) {
                  // go to public page
                  $location.path('/');
            }
            if (rejection.status == 400 || rejection.status == 404 || rejection.status == 500) {
                //FlashServiceStyled.show("une erreur s\'est produite: " + rejection.data["error"], "alert alert-error");
                $location.path('/');
            }
            // Return the promise rejection.
            return $q.reject(rejection);
          }
        };
    });
    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('HttpInterceptor');
}).config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}).run(['$rootScope', '$location', 'FlashServiceStyled', 'security','currentUser','$state','Message', 'MessageService', 'Faye', function($rootScope, $location, FlashServiceStyled, security, currentUser, $state, Message, MessageService, Faye) {
    
    $rootScope.$location = $location;
    $rootScope.racine_images ='/app/images/';
    //$rootScope.racine_images ='/app/bower_components/charte-graphique-laclasse-com/images/';

    // check authorization before changing states .
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      console.log('state changed');
      console.log(MessageService.getMessage());
      // before loading the new state => check rights
      security.requestCurrentUser().then(function(user) {
        currentUser = user;
        if (security.isAuthenticated()) {
          var authorized = security.isAuthorized(toState.authorizedRoles);
          if (!authorized && toState.url!=fromState.url && fromState.url!='^') {
            // you don not have rights ..
            event.preventDefault();
            $state.transitionTo('home');
          }
        }
      });
    });

    //check resolve errors ..  
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
      if (error == "invalid message") {
        event.preventDefault();
        alert('le message est pas valide');
        $state.transitionTo('home');
      }
    });   

    $rootScope.$state = $state;
    $rootScope.title = "title";
    $rootScope.messageObject = MessageService.getMessage();
    $rootScope.tinymceModel = "template";
    window.scope = $rootScope;
    FlashServiceStyled.show('bienvenu au publispostage', 'alert alert-success');
}]);
