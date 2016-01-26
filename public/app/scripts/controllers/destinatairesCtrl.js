'use strict';

angular.module( 'myApp' )
  .controller( 'destinatairesCtrl', [ '$scope', 'security', 'Regroupements', '$location', '$rootScope', 'MessageService', 'Redirect',
    'colors', 'Menus', '$state', 'Personnels', 'Matieres',
    function ( $scope, security, Regroupements, $location, $rootScope, MessageService, Redirect,
      colors, Menus, $state, Personnels, Matieres ) {
      // making Redirect utils accesible in the scope
      $scope.Redirect = Redirect;
      $scope.security = security;

      // Libellé représentant le choix des destinataires
      $scope.destinataires_libelle = "";

      // if current state == destinataire
      if ( $state.current.name == "destinataire" ) {
        MessageService.addMessageType( $state.params[ 'type' ] );
      }

      //initialize destinations
      $scope.destinations = new Array();

      var getPersonnel = function ( uai ) {
        Personnels.all( {},
          function ( personnels ) {
            $scope.personnels = personnels;
            var selectdestinationsIds = new Array();
            _( MessageService.getMessage().destinations ).each( function ( dest ) {
              selectdestinationsIds.push( dest.id );
            } );
            _( $scope.personnels ).each( function ( element ) {
              if ( _( selectdestinationsIds ).contains( element.id ) ) {
                element[ 'checked' ] = true;
                $scope.destinations.push( element );
              }
            } );
          },
          function ( error ) {
            console.log( error );
          } );
      };

      // get the list of user regroupements
      security.requestCurrentUser().then( function ( user ) {
        $scope.currentUser = user;
        if ( $state.params[ 'type' ] == 'ecrire_personnels' ) {
          getPersonnel( $scope.currentUser.info[ 'ENTPersonStructRattachRNE' ] );
        } else {

          if ( $state.params[ 'type' ] == 'ecrire_profs' ) {
            $scope.matieres = [ {
              id: -1,
              libelle_long: 'Toutes'
            } ];
            $scope.matiere = _.isUndefined( MessageService.getMessage().matiere ) ? $scope.matieres[ 0 ].id : MessageService.getMessage().matiere;
            Matieres.all( {}, function ( matieres ) {
              $scope.matieres = $scope.matieres.concat( matieres );
            } );
          }

          Regroupements.get( {
            id: user.info[ 'uid' ]
          }, function ( regroupements ) {
            var selectdestinationsIds = new Array();
            _.each( MessageService.getMessage().destinations, function ( dest ) {
              selectdestinationsIds.push( dest.id );
            } );

            $scope.regroupements = regroupements;
            // add colors to classes
            var colorIndex = 0;
            $scope.regroupements[ 'regroupements' ].forEach( function ( element, index, array ) {
              element[ 'color' ] = colors[ colorIndex++ % colors.length ];
              if ( _.contains( selectdestinationsIds, element.id ) ) {
                element[ 'checked' ] = true;
                $scope.destinations.push( element );
              }
            } );
            // Add colors to empty squares
            if ( $scope.regroupements[ 'regroupements' ].length < 15 ) {
              $scope.empty_squares = new Array( 15 - $scope.regroupements[ 'regroupements' ].length );
              for ( var i = 0; i < $scope.empty_squares.length; i++ ) {
                $scope.empty_squares[ i ] = {
                  color: colors[ colorIndex++ % colors.length ]
                };
              }
            } else {
              $scope.empty_squares = [];
            }
          } );
        }
      } );
      // get the list of menus
      $scope.menus = Menus;

      /* select all functionality */
      $scope.selectAllMode = true;

      $scope.selectAll = function () {
        $scope.selectAllMode = false;
        if ( $scope.regroupements != undefined && $scope.regroupements[ 'regroupements' ] != undefined ) {
          $scope.regroupements[ 'regroupements' ].forEach( function ( element, index, array ) {
            if ( !element[ 'checked' ] || _.isUndefined( element[ 'checked' ] ) ) {
              element[ 'checked' ] = true;
              $scope.destinations.push( element );
            }
          } );
        }
        if ( $scope.personnels != undefined ) {
          _.each( $scope.personnels, function ( person ) {
            person[ 'checked' ] = true;
            $scope.destinations.push( person );
          } );
        }
        $scope.formatHumanReadableLabel();
      };

      $scope.deselectAll = function () {
        $scope.selectAllMode = true;
        $scope.destinations = [];
        if ( $scope.regroupements != undefined && $scope.regroupements[ 'regroupements' ] != undefined ) {
          $scope.regroupements[ 'regroupements' ].forEach( function ( element, index, array ) {
            if ( element[ 'checked' ] || _.isUndefined( element[ 'checked' ] ) ) {
              element[ 'checked' ] = false;
            }
          } );
        }
        if ( $scope.personnels != undefined ) {
          _.each( $scope.personnels, function ( person ) {
            person[ 'checked' ] = false;
          } );
        }
        $scope.formatHumanReadableLabel();
      };

      $scope.addDestinations = function () {
        MessageService.setMatiere( $scope.matiere );
        MessageService.addDestinations( $scope.destinations );
        MessageService.addDestinatairesLabel( $scope.destinataires_libelle );
      };

      // Retirer ou ajouter des regroupements.
      $scope.addRemoveDestination = function ( object ) {
        var index = $scope.destinations.indexOf( object );
        if ( index > -1 ) {
          $scope.destinations.splice( index, 1 );
        } else {
          $scope.destinations.push( object );
        }
        $scope.formatHumanReadableLabel();
      };

      // Retirer ou ajouter des personnels
      $scope.addRemovePersonnel = function ( person ) {
        $scope.addRemoveDestination( person );
      };

      $scope.addProfils = function () {
        MessageService.addProfils( $scope.selectedProfils );
      };

      $scope.squareClass = function ( clazz ) {
        return clazz.color + ( clazz.checked ? '' : '-clear' );
      };

      // page ecrire tous
      // list of available profils
      $scope.profils = [ 'eleves', 'profs', 'parents' ];

      // les profils sélectionner
      $scope.selectedProfils = [];
      $scope.log = function () {}

      // selectionner tous les profils
      $scope.checkAll = function () {
        $scope.selectedProfils = [];
        $scope.selectedProfils = angular.copy( $scope.profils );
      };

      // déselectionner les profils
      $scope.uncheckAll = function () {
        $scope.selectedProfils = [];
      };

      $scope.$watch( "selectedProfils", function ( arr ) {
        $scope.selectedProfils = angular.copy( arr );
        $scope.formatHumanReadableLabel();
      }, true );

      $scope.noSelection = function () {
        if ( $state.params[ 'type' ] == 'ecrire_tous' )
          return $scope.destinations.length == 0 || $scope.selectedProfils.length == 0;
        else
          return $scope.destinations.length == 0;
      };

      //
      // Fonction de formatage de la liste des destinataires
      // Pour la rendre lisible par un humain.
      //
      $scope.formatHumanReadableLabel = function () {
        var type_dest = Menus[ $state.params[ 'type' ] ][ 'recpitualif' ];
        var libelle_matiere = "";
        var phrase = "@type_dest@ @liste_profils@ @liste_personnels@ @libelle_matiere@ @article_classes@ @liste_classes@ @article_groupes@ @liste_groupes@";
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
          _.each( $scope.selectedProfils, function ( p ) {
            liste_profils += p + ", ";
          } );
        }

        // Personnels
        if ( type_dest == "Personnels" ) {
          type_dest = "Ecrire à";
          _.each( $scope.destinations, function ( dest ) {
            liste_personnels += dest.destinataire_libelle + ", ";
          } );
        }

        // Matière
        if ( $scope.matiere != "" ) {
          _.each( $scope.matieres, function ( m ) {
            if ( m.id == $scope.matiere ) {
              libelle_matiere = "en " + m.libelle_long.toLowerCase();
              libelle_matiere = libelle_matiere.replace( 'en toutes', '' );
            }
          } );
        }

        // Classes et Groupes
        _.each( $scope.destinations, function ( dest ) {
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
        $scope.destinataires_libelle = '' + phrase
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