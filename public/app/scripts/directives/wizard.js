'use strict';

/****************************************************************************************/
/*                      WIZARD	Directive                                               */
/* Thanks to : https://github.com/smsohan/angular_wizard/                               */
/****************************************************************************************/
angular.module( 'wizardDirective', [] )
    .directive( 'wizard',
                function() {
                    return {
                        restrict: 'E',
                        transclude: true,

                        scope: {
                            onBeforeStepChange: '&',
                            onStepChanging: '&',
                            onAfterStepChange: '&'
                        },

                        templateUrl: 'wizard.html',

                        replace: true,

                        link: function ( scope ) {
                            scope.currentStepIndex = 0;
                            scope.steps[ scope.currentStepIndex ].currentStep = true;
                        },

                        controller: function ( $scope ) {
                            $scope.steps = [];

                            this.registerStep = function ( step ) {
                                $scope.steps.push( step );
                            };

                            var toggleSteps = function ( showIndex ) {
                                var event = {
                                    event: {
                                        fromStep: $scope.currentStepIndex,
                                        toStep: showIndex
                                    }
                                };

                                if ( $scope.onBeforeStepChange ) {
                                    $scope.onBeforeStepChange( event );
                                }
                                $scope.steps[ $scope.currentStepIndex ].currentStep = false;

                                if ( $scope.onStepChanging ) {
                                    $scope.onStepChanging( event );
                                }
                                $scope.currentStepIndex = showIndex;

                                $scope.steps[ $scope.currentStepIndex ].currentStep = true;
                                if ( $scope.onAfterStepChange ) {
                                    $scope.onAfterStepChange( event );
                                }
                            };

                            $scope.showNextStep = function () {
                                toggleSteps( $scope.currentStepIndex + 1 );
                            };

                            $scope.showPreviousStep = function () {
                                toggleSteps( $scope.currentStepIndex - 1 );
                            };

                            $scope.hasNext = function () {
                                return $scope.currentStepIndex < ( $scope.steps.length - 1 );
                            };

                            $scope.hasPrevious = function () {
                                return $scope.currentStepIndex > 0;
                            };

                            $scope.reset = function () {
                                toggleSteps( 0 );
                            };
                        }
                    };
                } )
    .directive( 'step',
                function() {
                    return {
                        require: "^wizard",
                        restrict: 'E',
                        transclude: true,
                        scope: {
                            title: '@'
                        },
                        template: '<div class="panel panel-default" ng-if="currentStep">' +
                            '<div class="panel-heading"><h4>{{title}}{{currentStepIndex}}</h4></div>' +
                            '<div class="panel-body">' +
                            '<div ng-transclude></div>' +
                            '</div></div>',
                        replace: true,

                        link: function ( scope, element, attrs, wizardController ) {
                            wizardController.registerStep( scope );
                        }
                    };
                } );
