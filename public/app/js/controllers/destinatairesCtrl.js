'use strict';

angular.module( 'publipostageClientApp' )
    .controller( 'destinatairesCtrl',
                 [ '$scope', '$filter', 'security', 'Regroupements', '$rootScope', 'MessageService', 'Redirect',
                   'colors', 'Menus', '$state', 'Personnels', 'Matieres',
                   function ( $scope, $filter, security, Regroupements, $rootScope, MessageService, Redirect,
                              colors, Menus, $state, Personnels, Matieres ) {
                       $scope.scope = $scope;
                       $scope.menus = Menus;
                       $scope.searchText = '';
                       $scope.regroupements_types = [ 'classe', 'groupe' ];
                       $scope.selected_regroupements_types = angular.copy( $scope.regroupements_types );

                       $scope.filter_regroupements = function() {
                           return function( regroupement ) {
                               return _($scope.selected_regroupements_types).contains(regroupement.type);
                           };
                       };

                       $scope.destinations = function() {
                           return _($scope.data).where({ checked: true });
                       };

                       /* select all functionality */
                       $scope.are_all_selected = function () {
                           return _.chain($scope.data).findWhere( { checked: false } ).isUndefined().value();
                       };

                       $scope.toggle_all_checked = function( value, force_all ) {
                           var data = force_all ? $scope.data : $filter('filter')( $scope.data, { libelle: $scope.searchText } );
                           _.chain( data )
                               .select( function( item ) {
                                   return !force_all && ( $state.params.type == 'ecrire_personnels' ) || $scope.filter_regroupements()( item );
                               } )
                               .each( function ( item ) {
                                   item.checked = value;
                               } );
                       };

                       $scope.noSelection = function () {
                           if ( $state.params.type == 'ecrire_tous' )
                               return _.chain($scope.data).findWhere( { checked: true } ).isUndefined().value() || $scope.selectedProfils.length == 0;
                           else
                               return _.chain($scope.data).findWhere( { checked: true } ).isUndefined().value();
                       };

                       // Retirer ou ajouter des regroupements.
                       $scope.addRemoveDestination = function ( object ) {
                           object.checked = !object.checked;
                       };

                       // page ecrire tous
                       $scope.profils = [ 'eleves', 'profs', 'parents' ];
                       $scope.selectedProfils = [];

                       $scope.next = function () {
                           MessageService.setMatiere( $scope.matiere );
                           MessageService.addDestinations( $scope.destinations() );
                           MessageService.addDestinatairesLabel( $scope.formatHumanReadableLabel() );

                           MessageService.addProfils( $scope.selectedProfils );

                           Redirect.goTo( 'message', { type: $state.params.type } );
                       };

                       MessageService.addMessageType( $state.params.type );

                       security.requestCurrentUser().then( function ( user ) {
                           $scope.currentUser = user;

                           if ( $state.params.type == 'ecrire_personnels' ) {
                               Personnels.query( {} )
                                   .$promise.then( function ( personnels ) {
                                       $scope.data = _( personnels ).map( function ( element ) {
                                           element.checked = !_.chain(MessageService.getMessage().destinations).findWhere({ id: element.id }).isUndefined().value();

                                           return element;
                                       } );
                                   } );
                           } else {
                               if ( $state.params.type == 'ecrire_profs' ) {
                                   $scope.matieres = [ { id: -1,
                                                         libelle_long: 'Toutes' } ];
                                   $scope.matiere = _(MessageService.getMessage().matiere).isUndefined() || _(MessageService.getMessage().matiere).isEmpty() ? $scope.matieres[ 0 ].id : MessageService.getMessage().matiere;
                                   Matieres.query( {} )
                                       .$promise.then( function ( matieres ) {
                                           $scope.matieres = $scope.matieres.concat( matieres );
                                       } );
                               }

                               Regroupements.get( { id: user.info.uid } )
                                   .$promise.then( function ( response ) {
                                       var colorIndex = 0;
                                       $scope.data = _(response.regroupements).map( function ( element ) {
                                           element.checked = !_.chain(MessageService.getMessage().destinations).findWhere({ regroupement_id: element.id }).isUndefined().value();
                                           element.color = colors[ colorIndex++ % colors.length ];

                                           return element;
                                       } );
                                   } );
                           }
                       } );









                       //
                       // Fonction de formatage de la liste des destinataires
                       // Pour la rendre lisible par un humain.
                       //
                       $scope.formatHumanReadableLabel = function () {
                           var phrase = "@type_dest@ @liste_profils@ @liste_personnels@ @libelle_matiere@ @article_classes@ @liste_classes@ @article_groupes@ @liste_groupes@";

                           var type_dest = Menus[ $state.params.type ].recapitulatif;
                           var libelle_matiere = "";
                           var article_classes = "",
                               article_groupes = "";
                           var liste_classes = "",
                               liste_groupes = "",
                               liste_personnels = "",
                               liste_profils = "";
                           var nbCls = 0,
                               nbGrp = 0;
                           var pluriel = "";

                           // Construire une belle phrase représentant la liste des destinataires.
                           // Profils (ecrire à tous)
                           if ( type_dest == "Profils" ) {
                               type_dest = ( $scope.selectedProfils.length == 0 ) ? "Tous les profils" : type_dest;
                               _($scope.selectedProfils).each( function ( p ) {
                                   liste_profils += p + ", ";
                               } );
                           }

                           // Personnels
                           if ( type_dest == "Personnels" ) {
                               type_dest = "Ecrire à";
                               _($scope.destinations()).each( function ( dest ) {
                                   liste_personnels += dest.destinataire_libelle + ", ";
                               } );
                           }

                           // Matière
                           if ( $scope.matiere != "" ) {
                               _($scope.matieres).each( function ( m ) {
                                   if ( m.id == $scope.matiere ) {
                                       libelle_matiere = "en " + m.libelle_long.toLowerCase();
                                       libelle_matiere = libelle_matiere.replace( 'en toutes', '' );
                                   }
                               } );
                           }

                           // Classes et Groupes
                           _($scope.destinations()).each( function ( dest ) {
                               if ( dest.type == 'classe' ) {
                                   liste_classes += dest.classe_libelle + ", ";
                                   nbCls++;
                               }
                               if ( dest.type == 'groupe' ) {
                                   liste_groupes += dest.groupe_libelle + ", ";
                                   nbGrp++;
                               }
                           } );

                           // Gestion du pluriel
                           if ( nbCls > 0 ) {
                               pluriel = ( nbCls > 1 ) ? "s" : "";
                               article_classes = ( pluriel != "" ) ? "des classes de" : "de la classe de";
                           }

                           if ( nbGrp > 0 ) {
                               pluriel = ( nbGrp > 1 ) ? "s" : "";
                               article_groupes = ( pluriel != "" ) ? "des groupes" : "du groupe";
                               // Ajouter "et" s'il y a aussi des classes
                               article_groupes = ( nbCls > 0 ) ? "et " + article_groupes : article_groupes;
                           }

                           // Constitution de la phrase.
                           return '' + phrase
                               .replace( '@type_dest@', type_dest )
                               .replace( '@liste_profils@', liste_profils )
                               .replace( '@liste_personnels@', liste_personnels )
                               .replace( '@libelle_matiere@', libelle_matiere )
                               .replace( '@article_classes@', article_classes )
                               .replace( '@liste_classes@', liste_classes )
                               .replace( '@article_groupes@', article_groupes )
                               .replace( '@liste_groupes@', liste_groupes )
                               .replace( /,(\s*)$/, '' )
                               .replace( / +(?= )/g, ' ' );
                       };
                   }
                 ] );
