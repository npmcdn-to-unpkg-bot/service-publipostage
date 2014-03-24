'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.controllers', 'ngRoute', 'ui.router','services.constants', 'ui.bootstrap',
                         'ui.tinymce', 'services.messages', 'services.authentication', 'angular-underscore',
                         'underscore.string', 'wizardDirective', 'ui.select2', 'services.resources', 'ngSanitize']).
config(['$urlRouterProvider' , '$stateProvider', 'APPLICATION_PREFIX', function($urlRouterProvider, $stateProvider, APPLICATION_PREFIX){
            
    /* defining states for routing */
    var home = {
        name: 'home',
        url: '/',
        templateUrl: APPLICATION_PREFIX+'/views/home.html',
        controller: 'HomeCtrl'
    };
    
    var gestion = {
        name: 'gestion',
        url: '/publi',
        templateUrl: APPLICATION_PREFIX+ '/views/liste.html', 
        controller:  'TestCtrl'
    }
    
    var createPublipostage = {
      name:'create',
      url: '/creer', 
      templateUrl: APPLICATION_PREFIX+'/views/create_publipostage.html',
      controller: 'MainCtl'
    }
    
    var profil = {
      name:'profil',
      url:'/profil',
      templateUrl: APPLICATION_PREFIX+'/views/profil.html',
      controller:'TestCtrl'
    }
    
    var type_message = {
      name:'type_message',
      url:'/type_message/:type',
      templateUrl: APPLICATION_PREFIX+'/views/type_message.html',
      controller:'MainCtrl'
    }
    
    var historique = {
      name:'histroique',
      url:'/historique/:id',
      templateUrl: APPLICATION_PREFIX+'/views/historique.html',
      controller:'TestCtrl'
    }
    
    var destinataire = {
      name:'destinataire',
      url:'/destinataire/:type',
      templateUrl: APPLICATION_PREFIX+'/views/destinataire.html',
      controller:'MainCtrl'
    }
    
    var message = {
      name:'message',
      url:'/message',
      templateUrl: APPLICATION_PREFIX+'/views/message.html',
      controller:'MainCtrl'
    }
    
    var apercu = {
      name:'apercu',
      url:'/apercu',
      templateUrl: APPLICATION_PREFIX+'/views/apercu.html',
      controller:'MainCtrl'
    }
    
    var envoi = {
      name:'envoi',
      url:'/envoi',
      templateUrl: APPLICATION_PREFIX+'/views/envoi.html',
      controller:'MainCtrl'
    }
    
    $stateProvider.state(home).state(gestion).state(createPublipostage).state(profil)
    .state(type_message)
    .state(historique)
    .state(destinataire)
    .state(message)
    .state(apercu)
    .state(envoi);
    $urlRouterProvider.otherwise('/');
    
}]).config(function ($provide, $httpProvider) {
    // Intercept http calls.
    $provide.factory('MyHttpInterceptor', function ($q, $location) {
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
              console.log(rejection); // Contains the data about the error.
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
    $httpProvider.interceptors.push('MyHttpInterceptor');
})
.run(['$rootScope', '$location', 'FlashServiceStyled', 'security','currentUser','$state', function($rootScope, $location, FlashServiceStyled, security, currentUser, $state) {
  $rootScope.$location = $location;
  $rootScope.racine_images ='/app/bower_components/charte-graphique-laclasse-com/images/';
  
  security.requestCurrentUser().then(function(user) {
      console.log(user);
      currentUser = user;
  });
  
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    console.log('state changed');
    console.log(fromState);
    console.log(toState);
    
    // before loading the new state => check rights
    security.requestCurrentUser().then(function(user) {
      //console.log(user);
      currentUser = user;
      if (security.isAuthenticated()) {
        // for the moment only admin can see the page of publipostage ..
        var allowed = _.find(currentUser.roles, function(role){return role[0]=="TECH"||role[0]=="PROF_ETB"||role[0]=="ADM_ETB"});
        if (typeof(allowed) == 'undefined' && toState.url!=fromState.url && fromState.url!='^') {
          // you don not have rights ..
          console.log('vous pouvez pas acceder');
          event.preventDefault();
          $state.transitionTo('home');
        }
      }
    });
  });
  
  $rootScope.$state = $state;
  window.scope = $rootScope;
  FlashServiceStyled.show('bienvenu au publispostage', 'alert alert-success');
  }]);
/*config(['$routeProvider', function($routeProvider) {
 $routeProvider.when('/', {templateUrl: '/app/views/partial1.html', controller: 'TestCtrl'});
  $routeProvider.when('/view2', {templateUrl: '/app/views/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/'});
}])*/