'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.controllers', 'ngRoute', 'ui.router','services.constants', 'ui.bootstrap',
                         'ui.tinymce', 'services.messages', 'services.authentication', 'underscore.string']).
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
    
}]).run(['$rootScope', '$location', 'FlashServiceStyled', 'security','currentUser', function($rootScope, $location, FlashServiceStyled, security, currentUser) {
  $rootScope.$location = $location;
  security.requestCurrentUser().then(function(user) {
      currentUser = user;
  });
  
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    console.log('state changed');
    security.requestCurrentUser().then(function(user) {
      console.log(user);
      currentUser.user = user.user;
      currentUser.info = user.info;
      var roles = _.str.words(currentUser.info.ENTPersonRoles, ",");
      console.log(roles);
      //console.log(currentUser);
      if (security.isAuthenticated()) {
        if (currentUser.user=="bsaleh") {
        
        } else
        {
          event.preventDefault();
        $location.url('/view2');
        $location.replace();
        }
      }
    });
    
   
      //User.get_user().then( function( response ) {
      //    var current_user = response.data;
      //    var allowed = _(current_user.profils).reduce(
      //        function( autorise, profil ) {
      //            return autorise && _(toState.data.auth).contains( profil.type );
      //        },
      //        true );
      //
      //    if ( ! allowed ) {
      //        event.preventDefault();
      //
      //        var profil_etab = _(current_user.profils).find( function( p ) {
      //            return p.uai == current_user.etablissement_actif;
      //        } );
      //
      //        switch ( profil_etab.type ) {
      //        case 'DIR':
      //            $location.url( '/principal' );
      //            break;
      //        case 'ENS':
      //            $location.url( '/enseignant' );
      //            break;
      //        case 'ELV':
      //            $location.url( '/eleve' );
      //            break;
      //        }
      //        $location.replace();
      //    }
      //} );
  });
  window.scope = $rootScope;
  FlashServiceStyled.show('bienvenu au publispostage', 'alert alert-success');
  }]);
/*config(['$routeProvider', function($routeProvider) {
 $routeProvider.when('/', {templateUrl: '/app/views/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: '/app/views/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/'});
}])*/