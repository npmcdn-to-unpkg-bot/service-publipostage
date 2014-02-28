'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.controllers', 'ngRoute', 'ui.router','services.constants', 'ui.bootstrap',
                         'ui.tinymce', 'services.messages', 'services.authentication', 'angular-underscore',
                         'underscore.string', 'wizardDirective', 'ui.select2', 'services.resources']).
config(['$urlRouterProvider' , '$stateProvider', 'APPLICATION_PREFIX', function($urlRouterProvider, $stateProvider, APPLICATION_PREFIX){
            
    /* defining states for routing */
    var home = {
        name: 'home',
        url: '/',
        templateUrl: APPLICATION_PREFIX+'/views/home.html',
        controller: 'MyCtrl1'
    };
    
    var gestion = {
        name: 'gestion',
        url: '/publi',
        templateUrl: APPLICATION_PREFIX+ '/views/liste.html', 
        controller:  'MyCtrl1'
    }
    
    var createPublipostage = {
      name:'create',
      url: '/creer', 
      templateUrl: APPLICATION_PREFIX+'/views/create_publipostage.html',
      controller: 'MyCtrl1'
    }
    
    $stateProvider.state(home).state(gestion).state(createPublipostage);
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
        var admin = _.find(currentUser.roles, function(role){return role[0]=="TECH"});
        if (typeof(admin) == 'undefined' && toState.url!=fromState.url && fromState.url!='^') {
          // you don not have rights ..
          console.log('not admin');
          event.preventDefault();
          $state.transitionTo('home');
          //$location.path("/"); //does not work with states ..
        }
      }
    });
  });
  window.scope = $rootScope;
  FlashServiceStyled.show('bienvenu au publispostage', 'alert alert-success');
  }]);
/*config(['$routeProvider', function($routeProvider) {
 $routeProvider.when('/', {templateUrl: '/app/views/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: '/app/views/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/'});
}])*/