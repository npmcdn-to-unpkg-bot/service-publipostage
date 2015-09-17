'use strict';

/******************************************* Destinataire Controller ****************************************/
Controllers.controller('destinatairesCtrl', ['$scope', 'security','Regroupements', '$location', '$rootScope', 'MessageService','Redirect', 
    'colors', 'Menus', '$state', 'Personnels', 'Matieres', function($scope,security, Regroupements, $location, $rootScope, MessageService, Redirect, 
    colors, Menus, $state, Personnels, Matieres){
    // making Redirect utils accesible in the scope
    $scope.Redirect = Redirect;
    $scope.security = security;
    // if current state == destinataire
    if ($state.current.name == "destinataire") {
        MessageService.addMessageType($state.params['type']);
    }
    //initialize destinations
    $scope.destinations = new Array();

    var getPersonnel = function(uai){
        Personnels.all({},function(personnels){
            $scope.personnels = personnels;
            var selectdestinationsIds = new Array();
            _.each(MessageService.getMessage().destinations, function(dest) {
              selectdestinationsIds.push(dest.id);
            });
            _.each($scope.personnels, function(element) {
              if(_.contains(selectdestinationsIds, element.id)) {
                element['checked'] = true;
                $scope.destinations.push(element);
              }
            });
        }, function(error){
            console.log(error);
        });
    };

    // get the list of user regroupements 
    security.requestCurrentUser().then(function(user) {
        $scope.currentUser = user;
        if ($state.params['type']=='ecrire_personnels') {
          getPersonnel($scope.currentUser.info['ENTPersonStructRattachRNE']);
        } else {

          if($state.params['type']=='ecrire_profs') {
            $scope.matieres = [{ id: -1 , libelle_long : 'Toutes'}];
            $scope.matiere = _.isUndefined(MessageService.getMessage().matiere) ? $scope.matieres[0].id : MessageService.getMessage().matiere;
            Matieres.all({}, function(matieres){
              $scope.matieres = $scope.matieres.concat(matieres);
            });
          }

          Regroupements.get({id:user.info['uid']}, function(regroupements){
            var selectdestinationsIds = new Array();
            _.each(MessageService.getMessage().destinations, function(dest) {
              selectdestinationsIds.push(dest.id);
            });

            $scope.regroupements = regroupements;
            // add colors to classes
            var colorIndex = 0;
            $scope.regroupements['regroupements'].forEach(function(element, index, array){
                element['color'] = colors[colorIndex++%colors.length];
                if(_.contains(selectdestinationsIds, element.id)) {
                    element['checked'] = true;
                    $scope.destinations.push(element);
                }
            });
            // Add colors to empty squares
            if ($scope.regroupements['regroupements'].length < 15) {
                $scope.empty_squares = new Array(15 - $scope.regroupements['regroupements'].length );
                console.log($scope.empty_squares);
                for (var i=0;i<$scope.empty_squares.length;i++){
                  $scope.empty_squares[i]={ color:colors[colorIndex++%colors.length] , };
                }
            } else
            {
                $scope.empty_squares = []
            }
          });
        }
    });
    // get the list of menus
    $scope.menus = Menus;
    
    /* select all functionality */
    $scope.selectAllMode = true;
    
    $scope.selectAll = function(){
        $scope.selectAllMode = false;
        if($scope.regroupements != undefined && $scope.regroupements['regroupements'] != undefined) {
          $scope.regroupements['regroupements'].forEach(function(element, index, array){
            if (!element['checked'] || _.isUndefined(element['checked'])){
              element['checked'] = true;
              $scope.destinations.push(element);
            }
          });
        }
    };

    $scope.deselectAll = function(){
        $scope.selectAllMode = true;
        $scope.destinations = [];
        if($scope.regroupements != undefined && $scope.regroupements['regroupements'] != undefined) {
          $scope.regroupements['regroupements'].forEach(function(element, index, array){
            if(element['checked'] || _.isUndefined(element['checked'])){
              element['checked'] = false;
            }
          });
        }
    };

    $scope.addDestinations = function(){
        console.log('add destinations ');
        MessageService.setMatiere($scope.matiere);
        MessageService.addDestinations($scope.destinations);
        console.log(MessageService.getMessage());
    };

    $scope.addRemoveDestination = function(object){
        var index = $scope.destinations.indexOf(object)
        if(index > -1){
            $scope.destinations.splice(index,1);
        }else{
            $scope.destinations.push(object);
        }
    };

    $scope.addProfils = function(){
        console.log('add profils');
        MessageService.addProfils($scope.selectedProfils);
    };

    $scope.squareClass = function(clazz) {
        return clazz.color + (clazz.checked ? '' : '-clear');
    }

    // page ecrire tous
    // list of available profils 
    $scope.profils = ['eleves', 'profs', 'parents'];

    // les profils sélectionner
    $scope.selectedProfils = [];
    $scope.log = function(){
        console.log($scope.selectedProfils);
    }

    // selectionner tous les profils
    $scope.checkAll = function(){
        $scope.selectedProfils = [];
        $scope.selectedProfils = angular.copy($scope.profils);
    }

    // déselectionner les profils
    $scope.uncheckAll = function(){
        $scope.selectedProfils = [];
    };

    $scope.$watch("selectedProfils", function(arr){
        console.log(arr);
    }, true);

    $scope.noSelection = function(){
        if ($state.params['type']=='ecrire_tous')
            return $scope.destinations.length == 0 || $scope.selectedProfils.length == 0;
        else
            return $scope.destinations.length == 0; 
    }

}]);
