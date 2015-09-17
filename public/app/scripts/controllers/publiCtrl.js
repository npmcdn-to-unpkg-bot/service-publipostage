'use strict';

Controllers.controller('publiCtrl', ['$rootScope', '$sce', 'security', 'Publipostages', 'currentUser', 'SVG_AVATAR_F', 'SVG_AVATAR_M', "$location", 'tinymceOptions',
  function($scope, $sce, security, Publipostages, currentUser, SVG_AVATAR_F, SVG_AVATAR_M, $location , tinymceOptions) {
    $scope.tinymceOptions = tinymceOptions;
    
    $scope.pageLimits = [5, 10, 20, 50]; 
    $scope.limit = 10;
    $scope.currentPage = 1;
    $scope.maxSize = 5;

    $scope.checked = {};
    $scope.check_all = false;
    var getPublipostages = function(page, limit){
        Publipostages.get({limit:limit, page:page}, function(publis){
        $scope.publis = publis.data;
        console.log($scope.publis);
        $scope.totalItems = publis.total;
        $scope.currentPage = publis.page;
        });
    }
    getPublipostages($scope.currentPage, $scope.limit);
    
    $scope.toTrustedHtml = function(html_code) {
        return $sce.trustAsHtml(html_code);
    };

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

    $scope.duplicPubli = function (id) {
      alert('Duplication pas encore active');
    }
    
    $scope.removePubli = function(id){
        if(confirm("Voulez-vous supprimer le publipostage?")){
            Publipostages.remove({id:id}, function(success){
                getPublipostages($scope.currentPage, $scope.limit);
            }, function(error){
                console.log(error);
            });
        }
    }
    $scope.pageChanged = function(newValue) {
        getPublipostages(newValue, $scope.limit);
    };

    $scope.limitChanged = function(newValue){
        $scope.limit = newValue;
        $scope.currentPage = 1;
        getPublipostages($scope.currentPage, newValue);
    };

    $scope.selectAll = function(){
        $scope.check_all = !$scope.check_all;
        angular.forEach($scope.publis, function(publi){
            $scope.checked[publi.id] = !$scope.checked[publi.id];
        });
    };

    $scope.selectPubli = function(id){
        console.log(id);
        //$scope.checked[id] = !$scope.checked[id];
    };

    $scope.removeSelectedPubli = function(){
        if(confirm("Voulez-vous supprimer les publipostages sélectionnés?")){
            Publipostages.remove({id:angular.toJson($scope.checked)}, 
                function(success){
                    $scope.check_all = false;
                    getPublipostages($scope.currentPage, $scope.limit);
                }, function(error){
                    console.log(error);
            });
        }
    };

    $scope.$watch('checked', function(newValue){console.log(newValue);}, true);

}]);
