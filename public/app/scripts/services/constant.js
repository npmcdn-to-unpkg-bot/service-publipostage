'use strict';

/* constant for static pages routing */
angular.module('services.constants', []); 
angular.module('services.constants').constant('APPLICATION_PREFIX', '/app');
angular.module('services.constants').constant('BASE_SERVICE_URL', '/app/api');


/* constants for icons */
angular.module('services.constants').constant('SVG_AVATAR_F' , "M118.05,127.561c0.044-0.232-1.54-12.343-1.555-12.588c0,0-2.954-7.807-7.623-8.603c-4.665-0.801-10.663-2.497-13.171-4.469c-1.467-1.163-6.242-3.175-8.454-4.013c-1.034-0.391-2.801-3.571-3.408-5.008 c-0.613-1.438-4.822-4.344-5.897-4.504l-0.167-5.983l12.188-3.95c0,0,3.14-1.518,3.443-1.518c0.31,0-1.452-2.407-1.685-3.055 c-0.228-0.64-1.377-5.005-1.377-5.005s4.115,5.243,6.2,6.224c0,0-4.1-8.017-5.317-12.483c-1.225-4.471-2.032-11.451-2.032-12.088 c0-0.642-2.524-19.39-3.901-22.499c-1.38-3.117-3.25-7.342-6.449-9.416c-3.202-2.075-7.947-5.029-14.762-5.424 c-0.103-0.004-0.204-0.004-0.306-0.015c-0.102,0.008-0.204,0.008-0.308,0.015c-6.81,0.396-11.556,3.351-14.755,5.424 c-3.198,2.072-5.068,6.3-6.449,9.416c-1.377,3.109-3.905,21.857-3.905,22.499c0,0.637-0.714,7.9-1.938,12.364 c-1.226,4.472-5.409,12.205-5.409,12.205c2.086-0.979,6.199-6.223,6.199-6.223s-1.481,4.79-1.714,5.432 c-0.233,0.644-1.653,2.629-1.347,2.629c0.305,0,3.447,1.518,3.447,1.518l12.19,3.95l-0.171,5.983 c-1.07,0.16-5.281,3.067-5.896,4.504c-0.615,1.437-2.377,4.617-3.408,5.008c-2.218,0.837-6.988,2.85-8.456,4.013 c-2.515,1.973-8.496,3.668-13.169,4.469c-4.669,0.794-7.619,8.057-7.619,8.057c-0.018,0.248-1.6,12.9-1.561,13.134H118.05z");

angular.module('services.constants').constant('SVG_AVATAR_M' , "M2.155,127.559V116.52c0,0,0.725-6.775,8.942-8.879c0,0,13.236-4.799,23.603-9.278c5.361-2.315,6.515-3.706,11.923-6.079 c0,0,0.564-2.756,0.361-4.396h4.229c0,0,0.966,0.56,0-5.921c0,0-5.155-1.356-5.396-11.677c0,0-3.872,1.296-4.107-4.958 c-0.162-4.239-3.465-7.918,1.29-10.957l-2.418-6.479c0,0-4.833-26.154,9.062-22.315c-5.86-6.958,33.229-13.916,35.769,8.158 c0,0,1.809,11.918,0,20.075c0,0,5.707-0.656,1.892,10.24c0,0-2.094,7.837-5.316,6.078c0,0,0.525,9.917-4.549,11.599 c0,0,0.36,5.276,0.36,5.638l4.834,0.719c0,0-0.727,4.321,0.121,4.802c0,0,5.731,3.896,12.564,5.64 c13.172,3.354,28.76,9.116,28.76,14.154c0,0,1.329,6.719,1.329,14.878H2.155V127.559z");

angular.module('services.constants').service('Squares', function($rootScope){
	var squares = [
                    { id: 'info_famille',
                      icon: $rootScope.racine_images + 'famille.svg',
                      color: 'vert',
                      text: 'écrire aux familles',
                      url: '/destinataire/info_famille',
                      authorizedRoles:["TECH", "ADM_ETB","PROF_ETB", "ELV_ETB"],
                      active: false
                    },
                    { id: 'write_profs',
                      icon: $rootScope.racine_images + 'profs.svg',
                      color: 'bleu',
                      text: 'écrire aux professeurs',
                      url: '/destinataire/ecrire_profs',
                      active: false
                    },
                    { id: 'write_eleves',
                      icon: $rootScope.racine_images + 'eleves.svg',
                      color: 'jaune',
                      text: 'écrire aux élèves',
                      url: '/destinataire/ecrire_eleves',
                      authorizedRoles:["TECH", "ADM_ETB","PROF_ETB", "ELV_ETB"],
                      active: false
                    },
                    { id: 'write_personnels',
                      icon: $rootScope.racine_images + 'personnel.svg',
                      color: 'rouge',
                      text: 'écrire aux personnels',
                      url: '/destinataire/ecrire_personnels',
                      active: false
                    },
                    { id: 'write_all',
                      icon: $rootScope.racine_images + 'tous.svg',
                      color: 'violet',
                      text: 'écrire à tous',
                      url: '/destinataire/ecrire_tous',
                      active: false
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'rouge-clear',
                      text: '',
                      url: '',
                      active: false
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'vert-clear',
                      text: '',
                      url: '/publi',
                      active: false
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'bleu-clear',
                      text: '',
                      url: '',
                      active: false
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'bleu-clear',
                      text: '',
                      url: '',
                      active: false
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'vert-clear',
                      text: '',
                      url: '',
                      active: false
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'violet-clear',
                      text: '',
                      url: '',
                      active: false
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'jaune-clear',
                      text: '',
                      url:'' ,
                      active: false
                    },
                    { id: 'admin',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'rouge-clear',
                      text: '',
                      url: '',
                      active: false
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'bleu-clear',
                      text: '',
                      url: '',
                      active: true
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'jaune-clear',
                      text: '',
                      url: '',
                      active: true
                    },
                    { id: '',
                      icon: $rootScope.racine_images + '00_vide.svg',
                      color: 'vert-clear',
                      text: '',
                      url: '',
                      active: true
                    }
                  ];
    return squares;        
});

angular.module('services.constants').constant('colors' , [ 'bleu', 'vert', 'rouge', 'violet', 'orange','jaune', 'gris1','gris2', 'gris3', 'gris4' ]);

angular.module('services.constants').service('Menus', function($rootScope){
  return {
				info_famille: {
				    left_menu_text:'info famille : pour diffuser un message aux famille d\'élèves',
				    left_menu_button_text: 'écrire une nouvelle info famille',
				    right_menu_text: 'écrire aux familles',
				    recpitualif: 'familles de ',
            icon :$rootScope.racine_images + 'famille.svg',
            color: "vert",
            icon_div:"famille-icon"
				},
				ecrire_profs:{
				    left_menu_text:'écrire aux prof : pour diffuser un message aux enseignants',
				    left_menu_button_text: 'écrire aux enseignant',
				    right_menu_text: 'écrire aux professeurs ',
				    recpitualif:'enseignant des classes:',
            icon :$rootScope.racine_images + 'profs.svg',
            color: "bleu",
            icon_div:"profs-icon"
				},
				ecrire_eleves:{
				    left_menu_text:'écrire aux élèves : pour diffuser un message aux enseignants',
				    left_menu_button_text: 'écrire aux élèves',
				    right_menu_text: 'écrire aux élèves',
				    recpitualif:'élèves de: ',
            icon :$rootScope.racine_images + 'eleves.svg',
            color: "jaune",
            icon_div:"eleves-icon"
				},
				ecrire_tous:{
				    left_menu_text:'écrire à tous',
				    left_menu_button_text: 'écrire à tous',
				    right_menu_text: 'écrire à tous',
				    recpitualif:'profils de: ',
            icon :$rootScope.racine_images + 'tous.svg',
            color: "violet",
            icon_div:"tous-icon"
				},
        ecrire_personnels:{
            left_menu_text:'écrire aux personnels',
            left_menu_button_text: 'écrire aux personnels',
            right_menu_text: 'écrire aux personnels',
            recpitualif:'',
            icon :$rootScope.racine_images + 'personnel.svg',
            color: "rouge",
            icon_div:"personnel-icon"
        },
      };
});

angular.module('services.constants').value('tinymceOptions', {
  // Test to place lang elsewhere and have it bower compliant
  language:"../../../scripts/externals/tinymce/lang/fr",
  menubar: false,
  theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
  font_size_style_values: "12px,13px,14px,16px,18px,20px",
  toolbar: "styleselect,fontsizeselect,sub,sup,|,bold,italic,underline,strikethrough,| alignleft,aligncenter,alignright | bullist,numlist",
  extended_valid_elements : "nom,civilite",
  //custom_elements: "nom,civilite",
  verify_html : false,
  height : 200,
  forced_root_block: false,
  handle_event_callback: function (e) {
      // put logic here for keypress
      console.log("callback called");
  }
});

angular.module('services.constants').value('templateItems', 
 [
  { value : '[civilite]', message :  'Civilité' },
  { value : '[nom]', message :  'Nom' },
  { value : '[prenom]', message :  'Prenom' },
  { value : '[adresse]', message :  'Adresse' },
  { value : '[date]', message :  'Date du Jours' },
  { value : '[signature]', message :  'Signature' },
  { value : '[nomEleve]', message :  'Nom de l\'élève'        , showOnly : ['info_famille']},
  { value : '[prenomEleve]', message :  'Prénom de l\'élève'  , showOnly : ['info_famille']},
  { value : '[classe]', message :  'Classe' },
  { value : '[matiere]', message :  'Matière'                 , showOnly : ['ecrire_profs']},
  { value : '[loginLaClasse]', message :  'Login LaClasse.com'       , showOnly : ['info_famille', 'ecrire_eleves'] , rolePriorityMin :2},
  { value : '[pwdLaClasse]', message :  'Mot de passe LaClasse.com'  , showOnly : ['info_famille', 'ecrire_eleves'] , rolePriorityMin :2},
  { value : '[blogEtab]', message :  'Lien blog de l\'etablissement' },
  { value : '[blogRegroupement]', message :  'Lien blog du groupe ou de la classe' },
  { value : '<a href=\'http://www.laclasse.com\'>Laclasse</a>', message :  'Lien Laclasse.com' }
  ]
);
