'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.controllers', 'ngRoute', 'ui.router', 'services.constants', 'ui.bootstrap', 'ui.tinymce']).
config(['$urlRouterProvider' , '$stateProvider', 'APPLICATION_PREFIX', function($urlRouterProvider, $stateProvider, APPLICATION_PREFIX){
            
    /* defining states for routing */
    var home = {
        name: 'home',
        url: '/',
        templateUrl: APPLICATION_PREFIX+'/views/partial1.html',
        controller: 'MyCtrl1'
    };
    
    var view2 = {
        name: 'view2',
        url: '/view2',
        templateUrl: APPLICATION_PREFIX+ '/views/partial2.html', 
        controller:  'MyCtrl2'
    }
    
    $stateProvider.state(home).state(view2);
    $urlRouterProvider.otherwise('/');
    
}]).run(['$rootScope', '$location', function($rootScope, $location) {
  $rootScope.$location = $location;
  window.scope = $rootScope;
}]);
/*config(['$routeProvider', function($routeProvider) {
 $routeProvider.when('/', {templateUrl: '/app/views/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: '/app/views/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/'});
}])*/