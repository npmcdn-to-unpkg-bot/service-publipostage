'use strict';

angular.module( 'publipostageClientApp' )
    .controller( 'ModeDiffusionCtrl',
                 [ '$scope', '$rootScope', '$state', 'Menus', 'MessageService', 'Publipostages', 'DiffusionInfo',
                   function ( $scope, $rootScope, $state, Menus, MessageService, Publipostages, DiffusionInfo ) {
                       $scope.menus = Menus;

                       $scope.sendMessage = function( location ) {
                           MessageService.setDiffusionType( $scope.diffusion_type );

                           var message = MessageService.getMessage();
                           var publipostage = { descriptif: message.title,
                                                message: message.message,
                                                destinataires: message.destinations,
                                                destinataires_libelle: message.destinataires_libelle,
                                                message_type: message.messageType,
                                                diffusion_type: message.diffusion_type,
                                                profils: message.profils,
                                                matiere_id: message.matiere };


                           var success = function( location ) {
                               return function( data ) {
                                   $rootScope.created_publi = data;
                                   MessageService.reset();
                                   $state.go( 'envoi', { type: location } );
                               };
                           };
                           var error = function( error ) {
                               console.log( error );
                               $state.go( 'error', { message: error.data.error } );
                           };

                           // check if message is valid ..
                           if ( !_(message.title).isEmpty() && !_(message.message).isEmpty() ) {
                               if ( _(message.id).isUndefined() || _(message.id).isNull() ) {
                                   Publipostages.save( publipostage, success( location ), error );
                               } else { // MAJ d'un publipostage existant
                                   publipostage.id = message.id;
                                   Publipostages.update( publipostage, success( location ), error );
                               }
                           }
                       };

                       var addDiffusionData = function ( data ) {
                           $rootScope.diffusion_info.nb_email += data.with_email;
                           $rootScope.diffusion_info.nb_pdf += data.without_email;
                           $rootScope.diffusion_info.nb_total += data.with_email + data.without_email;
                       };

                       $rootScope.diffusion_info = { nb_email: 0,
                                                     nb_pdf: 0,
                                                     nb_total: 0 };

                       if ( $rootScope.messageObject.messageType == 'ecrire_personnels' ) {
                           var data = { with_email: 0,
                                        without_email: 0 };
                           _($rootScope.messageObject.destinations).each( function ( el ) {
                               if ( _.isEmpty( el.email_principal ) ) {
                                   data.without_email += 1;
                               } else {
                                   data.with_email += 1;
                               }
                           } );
                           addDiffusionData( data );
                       } else {
                           var regroupements = _.chain( $rootScope.messageObject.destinations )
                               .map( function( el ) {
                                   if ( _(el).has( 'classe_id' ) ) {
                                       return el.classe_id;
                                   } else if (  _(el).has( 'groupe_id' ) ) {
                                       return el.groupe_id;
                                   } else {
                                       return null;
                                   }
                               } ).compact().value().join('_');

                           if ( !_(regroupements).isEmpty() ) {
                           if ( $rootScope.messageObject.messageType === 'ecrire_tous' ) {
                               var infer_population = function( profil ) {
                                   switch( profil ) {
                                   case 'eleves': return 'students';
                                   case 'profs': return 'professors';
                                   case 'parents': return 'family';
                                   default: return null;
                                   }
                               };

                               _($rootScope.messageObject.profils).each( function( profil ) {
                                   DiffusionInfo.get( { population: infer_population( profil ),
                                                        regroupements: regroupements })
                                       .$promise
                                       .then( function ( data ) {
                                           addDiffusionData( data );
                                       } );
                               } );
                           } else {
                               var infer_population = function( message_type ) {
                                   switch( message_type ) {
                                   case 'ecrire_eleves': return 'students';
                                   case 'ecrire_profs': return 'professors';
                                   case 'info_famille': return 'family';
                                   default: return null;
                                   }
                               };

                               DiffusionInfo.get( { population: infer_population( $rootScope.messageObject.messageType ),
                                                    regroupements: regroupements } )
                                   .$promise
                                   .then( function ( data ) {
                                       addDiffusionData( data );
                                   } );
                           }
                       }
                   }
                 }
               ] );
