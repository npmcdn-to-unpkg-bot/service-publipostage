'use strict';

angular.module( 'myApp' )
  .controller( 'ModeDiffusionCtrl', [ '$scope', '$location', '$rootScope', '$state', 'Menus', 'MessageService', 'Publipostages', 'DiffusionInfo',
    function ( $scope, $location, $rootScope, $state, Menus, MessageService, Publipostages, DiffusionInfo ) {

      // get the list of menus
      $scope.menus = Menus;

      $scope.sendMessage = function ( location ) {
        //Set selected diffusion type
        MessageService.setDiffusionType( $scope.diffusion_type );

        var message = MessageService.getMessage();
        // check if message is valid ..
        if ( message.title != "" && message.message != "" ) {
          if ( message.id == undefined || message.id == null ) {
            // Nouveau publipostage
            console.log( "save new publipostage" );
            Publipostages.save( {
                'descriptif': message.title,
                'message': message.message,
                'destinataires': message.destinations,
                'destinataires_libelle': message.destinataires_libelle,
                'message_type': message.messageType,
                'diffusion_type': message.diffusion_type,
                'profils': message.profils,
                'matiere_id': message.matiere
              },
              function ( data ) {
                $rootScope.created_publi = data;
                // reinitialize message service
                MessageService.reset();
                $location.path( '/envoi/' + location );
              },
              function ( error ) {
                console.log( error );
                $location.path( '/error/' + error[ 'data' ].error );
                // show a message interface ..
              }
            );
          } else // MAJ d'un publipostage existant
          {
            Publipostages.update( {
                'id': message.id,
                'descriptif': message.title,
                'message': message.message,
                'destinataires': message.destinations,
                'destinataires_libelle': message.destinataires_libelle,
                'message_type': message.messageType,
                'diffusion_type': message.diffusion_type,
                'profils': message.profils,
                'matiere_id': message.matiere
              },
              function ( data ) {
                $rootScope.created_publi = data;
                // reinitialize message service
                MessageService.reset();
                $location.path( '/envoi/' + location );
              },
              function ( error ) {
                console.log( error );
                $location.path( '/error/' + error[ 'data' ].error );
                // show a message interface ..
              }
            );

          }
        }
      };

      $scope.resetDiffusionCounter = function () {
        $rootScope.diffusion_info = {
          nb_email: '?',
          nb_pdf: '?',
          nb_total: '?'
        }
      };

      $scope.addDiffusionData = function ( data ) {
        var diffusion_info = $rootScope.diffusion_info;

        if ( diffusion_info.nb_email == '?' ) diffusion_info.nb_email = 0;
        if ( diffusion_info.nb_pdf == '?' ) diffusion_info.nb_pdf = 0;
        if ( diffusion_info.nb_total == '?' ) diffusion_info.nb_total = 0;

        diffusion_info.nb_email += data.with_email;
        diffusion_info.nb_pdf += data.without_email;
        diffusion_info.nb_total += data.with_email + data.without_email;

        $rootScope.diffusion_info = diffusion_info;
      };

      $scope.resetDiffusionCounter();

      if ( $location.$$path.indexOf( '/mode_diffusion/ecrire_personnels' ) == 0 ) {
        var data = {
          with_email: 0,
          without_email: 0
        };
        _.each( $rootScope.messageObject[ 'destinations' ], function ( el ) {
          if ( _.isEmpty( el.email_principal ) ) {
            data.without_email += 1;
          } else {
            data.with_email += 1;
          }
        } );
        $scope.addDiffusionData( data );
      } else {
        var regroupements = '';
        _.each( $rootScope.messageObject[ 'destinations' ], function ( el ) {
          var splitChar = "_"
          if ( !_.isUndefined( el.classe_id ) ) {
            regroupements += el.classe_id + splitChar;
          } else if ( !_.isUndefined( el.groupe_id ) ) {
            regroupements += el.groupe_id + splitChar;
          }
        } );
        if ( regroupements != '' ) {

          //Cas des élèves
          if ( $location.$$path.indexOf( '/mode_diffusion/ecrire_eleves' ) == 0 ) {
            DiffusionInfo.listStudents( {
              regroupements: regroupements
            }, function ( data ) {
              $scope.addDiffusionData( data );
            } );
          } else if ( $location.$$path.indexOf( '/mode_diffusion/ecrire_profs' ) == 0 ) {
            DiffusionInfo.listProfessors( {
              regroupements: regroupements,
              matiere: MessageService.getMessage().matiere
            }, function ( data ) {
              $scope.addDiffusionData( data );
            } );
          } else if ( $location.$$path.indexOf( '/mode_diffusion/info_famille' ) == 0 ) {
            DiffusionInfo.listFamilly( {
              regroupements: regroupements
            }, function ( data ) {
              $scope.addDiffusionData( data );
            } );
          } else if ( $location.$$path.indexOf( '/mode_diffusion/ecrire_tous' ) == 0 ) {
            var profiles = $rootScope.messageObject[ 'profils' ];
            if ( _.contains( profiles, "parents" ) ) {
              DiffusionInfo.listFamilly( {
                regroupements: regroupements
              }, function ( data ) {
                $scope.addDiffusionData( data );
              } );
            }
            if ( _.contains( profiles, "profs" ) ) {
              DiffusionInfo.listProfessors( {
                regroupements: regroupements
              }, function ( data ) {
                $scope.addDiffusionData( data );
              } );
            }
            if ( _.contains( profiles, "eleves" ) ) {
              DiffusionInfo.listStudents( {
                regroupements: regroupements
              }, function ( data ) {
                $scope.addDiffusionData( data );
              } );
            }
          }
        }
      }
    }
  ] );