'use strict';

angular.module( 'myApp' )
    .controller('EnvoiCtrl', ['$scope', 'security', '$location', '$rootScope', 'MessageService', '$state', 'Menus',
                              function($scope, security, $location, $rootScope, MessageService, $state, Menus){

                                  // get the list of menus
                                  $scope.menus = Menus;

                                  // What to show
                                  $scope.showPdf = false;
                                  $scope.showEmail = false;
                                  $scope.showNews = false;

                                  // Set counter and displayRules
                                  var diffusion_info = $rootScope.diffusion_info;

                                  switch($rootScope.created_publi.diffusion_type) {
                                  case 'email' :
                                      $scope.showEmail = true;
                                      $scope.nb_email = diffusion_info.nb_email;

                                      if(diffusion_info.nb_pdf > 0){
                                          $scope.showPdf = true;
                                      } else {
                                          $scope.showPdf = false;
                                      }
                                      $scope.nb_pdf = diffusion_info.nb_pdf;
                                      break;
                                  case 'pdf' :
                                      $scope.showPdf = true;
                                      $scope.nb_pdf = diffusion_info.nb_total;
                                      break;
                                  case 'news' :
                                      $scope.showNews = true;
                                      $scope.nb_info = diffusion_info.nb_total;
                                      break;
                                  }
                              }
                             ]);
