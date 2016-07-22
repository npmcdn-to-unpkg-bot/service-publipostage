'use strict';

angular.module( 'publipostageClientApp' )
    .controller( 'EnvoiCtrl',
                 [ '$scope', '$rootScope', 'Menus',
                   function ( $scope, $rootScope, Menus ) {
                       $scope.menus = Menus;

                       // What to show
                       $scope.showPdf = false;
                       $scope.showEmail = false;
                       $scope.showNews = false;

                       // Set counter and displayRules
                       switch ( $rootScope.created_publi.diffusion_type ) {
                       case 'email':
                           $scope.showEmail = true;
                           $scope.nb_email = $rootScope.diffusion_info.nb_email;
                           $scope.showPdf = $rootScope.diffusion_info.nb_pdf > 0;
                           $scope.nb_pdf = $rootScope.diffusion_info.nb_pdf;
                           break;
                       case 'pdf':
                           $scope.showPdf = true;
                           $scope.nb_pdf = $rootScope.diffusion_info.nb_total;
                           break;
                       case 'news':
                           $scope.showNews = true;
                           $scope.nb_info = $rootScope.diffusion_info.nb_total;
                           break;
                       }
                   }
                 ] );
