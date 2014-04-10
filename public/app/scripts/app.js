'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.controllers', 'ngRoute', 'ui.router','services.constants', 'ui.bootstrap',
                         'ui.tinymce', 'services.messages', 'services.authentication', 'angular-underscore',
                         'underscore.string', 'wizardDirective', 'ui.select2', 'services.resources', 'ngSanitize', 'services.utils']).
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
      controller:  'TestCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"]
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
      controller:'TestCtrl',
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
      controller:'TestCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"]
    }
    
    var destinataire = {
      name:'destinataire',
      url:'/destinataire/:type',
      templateUrl: APPLICATION_PREFIX+'/views/destinataire.html',
      controller:'MainCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"]
    }
    
    var message = {
      name:'message',
      url:'/message/:type',
      templateUrl: APPLICATION_PREFIX+'/views/message.html',
      controller:'MainCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"]
    }
    
    var apercu = {
      name:'apercu',
      url:'/apercu/:type',
      templateUrl: APPLICATION_PREFIX+'/views/apercu.html',
      controller:'MainCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"]
    }
    
    var mode_diffusion = {
      name: 'mode_diffusion',
      url:'/mode_diffusion/:type',
      templateUrl: APPLICATION_PREFIX+'/views/mode_diffusion.html',
      controller:'MainCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"]
    }
    
    var envoi = {
      name:'envoi',
      url:'/envoi',
      templateUrl: APPLICATION_PREFIX+'/views/envoi.html',
      controller:'MainCtrl',
      authorizedRoles: ["TECH", "ADM_ETB","PROF_ETB"]
    }

    var annonce = {
      name:'annonce',
      url:'/annonce',
      templateUrl:APPLICATION_PREFIX+'/views/annonce.html',
      controller:'AnnonceCtrl',
      authorizedRoles: ["TECH"]
    }

    var annonce_for = {
      name:'annonce_for',
      url:'/annonce/:param',
      template:'annonce pour',
      authorizedRoles: ["TECH"]
    }
    
    $stateProvider.state(home).state(gestion).state(createPublipostage).state(profil)
    .state(type_message)
    .state(historique)
    .state(destinataire)
    .state(message)
    .state(apercu)
    .state(mode_diffusion)
    .state(envoi)
    .state(annonce_for)
    .state(annonce);
    $urlRouterProvider.otherwise('/');
    
}]).config(function ($provide, $httpProvider) {
    // Intercept http calls.
    $provide.factory('HttpInterceptor', function ($q, $location) {
        return {
        // On request success
        request: function (config) {
          //console.log(config); // Contains the data about the request before it is sent.
          // Return the config or wrap it in a promise if blank.
          return config || $q.when(config);
        },
        // On request failure
        requestError: function (rejection) {
          //console.log(rejection); // Contains the data about the error on the request.
          // Return the promise rejection.
          return $q.reject(rejection);
        },
        // On response success
        response: function (response) {
          //console.log(response); // Contains the data from the response.
          // Return the response or promise.
          return response || $q.when(response);
        },
        // On response failture
        responseError: function (rejection) {
          //console.log(rejection); // Contains the data about the error.
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
}).run(['$rootScope', '$location', 'FlashServiceStyled', 'security','currentUser','$state','Message', 'MessageService', function($rootScope, $location, FlashServiceStyled, security, currentUser, $state, Message, MessageService) {
    
    $rootScope.$location = $location;
    $rootScope.racine_images ='/app/images/';
    //$rootScope.racine_images ='/app/bower_components/charte-graphique-laclasse-com/images/';

    security.requestCurrentUser().then(function(user) {
      console.log(user);
      currentUser = user;
    });

    // check authorization before changing states .
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      console.log('state changed');
      console.log(toState);

      // before loading the new state => check rights
      security.requestCurrentUser().then(function(user) {
        currentUser = user;
        if (security.isAuthenticated()) {
          var authorized = security.isAuthorized(toState.authorizedRoles);
          if (!authorized && toState.url!=fromState.url && fromState.url!='^') {
            // you don not have rights ..
            console.log('désolé, vous pouvez pas acceder');
            event.preventDefault();
            $state.transitionTo('home');
          }
        }
      });
    });
  
    $rootScope.$state = $state;
    $rootScope.title = "title";
    $rootScope.messageObject = MessageService.getMessage();
    $rootScope.tinymceModel = "";
    window.scope = $rootScope;
    FlashServiceStyled.show('bienvenu au publispostage', 'alert alert-success');
}]);
