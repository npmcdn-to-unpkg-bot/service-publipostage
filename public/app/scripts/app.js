'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.controllers', 'ngRoute', 'ui.router','services.constants', 'ui.bootstrap',
                         'ui.tinymce', 'services.messages', 'services.authentication', 'angular-underscore',
                         'underscore.string', 'wizardDirective', 'ui.select2', 'services.resources', 'ngSanitize', 'services.utils', 
                         'pdf', 'chieffancypants.loadingBar', 'services.directives', 'checklist-model' , 'publipostageFilters']).
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

    var checkMessage = function($q, $timeout, MessageService, forPage){
      var deferred = $q.defer();
      if (!MessageService.isValid(forPage))
        deferred.reject("invalid message");
      else
        deferred.resolve("valid message");
      return deferred.promise;
    };
    
    var destinataire = {
      name:'destinataire',
      url:'/destinataire/:type',
      templateUrl: APPLICATION_PREFIX+'/views/destinataire.html',
      controller:'destinatairesCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB", "ELV_ETB"],
      resolve :{
        checkMessage: function($q, $timeout, MessageService) {
          return checkMessage($q, $timeout, MessageService,this.name);
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
        checkMessage: function($q, $timeout, MessageService) {
          return checkMessage($q, $timeout, MessageService,this.name);
        }
      }
    }
    
    var apercu = {
      name:'apercu',
      url:'/apercu/:type',
      templateUrl: APPLICATION_PREFIX+'/views/apercu.html',
      controller:'MainCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"],
      resolve :{
        checkMessage: function($q, $timeout, MessageService) {
          return checkMessage($q, $timeout, MessageService,this.name);
        }
      }
    }
    
    var mode_diffusion = {
      name: 'mode_diffusion',
      url:'/mode_diffusion/:type',
      templateUrl: APPLICATION_PREFIX+'/views/mode_diffusion.html',
      controller:'MainCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"],
      resolve :{
        checkMessage: function($q, $timeout, MessageService) {
          return checkMessage($q, $timeout, MessageService,this.name);
        }
      }
    }
    
    var envoi = {
      name:'envoi',
      url:'/envoi/:type',
      templateUrl: APPLICATION_PREFIX+'/views/envoi.html',
      controller:'EnvoiCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"]
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
      templateUrl: APPLICATION_PREFIX +'/views/error.html',
      authorizedRoles: "all"
    }
    
    $stateProvider.state(home)
    .state(gestion)
    .state(createPublipostage)
    .state(type_message)
    .state(historique)
    .state(destinataire)
    .state(message)
    .state(apercu)
    .state(mode_diffusion)
    .state(envoi)
    .state(error)
    .state(fichier);
    
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
            }
            if (rejection.status== 403 || rejection.status == 401) {
                  // not authorized go to public page
                  $location.path('/');
            }
            if (rejection.status == 400 || rejection.status == 404 || rejection.status == 500) {
                //server or response error
                $location.path('/error/'+rejection.status);
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
}).run(['$rootScope', '$location', 'FlashServiceStyled', 'security','currentUser','$state','MessageService',
  function($rootScope, $location, FlashServiceStyled, security, currentUser, $state, MessageService) {
    
    $rootScope.$location = $location;
    $rootScope.racine_images ='/app/images/';
    // check authorization before changing states .
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
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
        alert('le message n\'est pas valide');
        $state.transitionTo('home');
      }
    });   

    $rootScope.$state = $state;
    $rootScope.title = "title";
    $rootScope.tinymceModel = "template";
    window.scope = $rootScope;
    FlashServiceStyled.show('bienvenu au publispostage', 'alert alert-success');
}]);
