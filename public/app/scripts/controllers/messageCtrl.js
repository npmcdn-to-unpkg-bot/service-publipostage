'use strict';

/********************************* Massage controller*****************************************/
Controllers.controller('MassageCtrl', ['$scope', '$location', '$rootScope', '$filter', 'MessageService','Redirect', 'Menus', '$state', 'templateItems', 'security', "nameRoles",
    function($scope, $location, $rootScope, $filter, MessageService, Redirect, Menus, $state, templateItems, security, nameRoles){

        //Template items
        $scope.templateItems =  templateItems;

        // load message from the root ..
        $scope.title = MessageService.getMessage()['title'];
        $scope.htmlMessage = MessageService.getMessage()['message'];

        // get the list of menus
        $scope.menus = Menus;

        String.prototype.endsWith = function(suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
        
        $scope.addToMessage = function(text){
            security.requestCurrentUser().then(function(user) {    
                /*
                 * Append space if message is not empty and doesn't ends with space nor Carriage return
                 */
                console.log("avant : " + $scope.htmlMessage);

                if(_.isString($scope.htmlMessage) && $scope.htmlMessage.length > 0 && !($scope.htmlMessage.endsWith("&nbsp;") || $scope.htmlMessage.endsWith("<br/>") || $scope.htmlMessage.endsWith("</p>"))) {
                  text  = " "  + text;
                }
                $scope.htmlMessage += text;
                console.log("après : " + $scope.htmlMessage);
            });
        }
        
        $scope.goToPreview = function(location){
            console.log('add message to preview');
            if ($scope.title == "") {
                // TODO : affichage du message plus joli qu'une simple alerte.
                alert('Le titre de votre publipostage est vide !');
            } else {
                MessageService.addMessage($scope.htmlMessage, $scope.title)
                $location.path('/apercu/'+location);
            }
        }

        $scope.goToDestinataire = function(location){
            $location.path('/destinataire/'+location);
        }
        
        $scope.addType = function(){
            MessageService.addType('test');
        }
    
}]);
