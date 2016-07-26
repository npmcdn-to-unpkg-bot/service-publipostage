'use strict';

angular.module( 'publipostageClientApp' )
    .controller( 'PDFViewerCtrl',
                 [ '$scope', '$state',
                   function( $scope, $state ) {
                       $scope.pdfUrl = 'api/publipostage/' + $state.params.id + '/pdf';
                   } ] );
