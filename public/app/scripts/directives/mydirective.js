'use strict';

var myDirectives = angular.module('myApp.directives',[]);
angular.module('myApp.directives')
  .directive('myDirective', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the myDirective directive');
      }
    };
  }).directive('gritterAdd', ['$rootScope', function ($rootScope) {
		    return {
		      restrict: 'A',
		      link: function (scope, element) {
		        scope.$watch('grittorMessage', function(newmsg){
		        	if (!angular.isUndefined(newmsg)){
			        	element.gritter.add({
			            title: newmsg.title,
			            text: newmsg.msg,
			            image: 'http://a0.twimg.com/profile_images/59268975/jquery_avatar_bigger.png',
			            sticky: false,
			            time: '',
		         	 	});
		        	}
		        });
		      },
		    controller: ['$scope', function ($scope) { 
		    	$rootScope.$on("growlMessage", function (event, message) {
		    		console.log(message);
		    		$scope.grittorMessage = message;
		    	});
		    }]
		};
}]);
