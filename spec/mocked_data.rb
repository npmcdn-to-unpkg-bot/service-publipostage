# -*- coding: utf-8 -*-
MOCKED_DATA = {
    'id' => 1,
    'id_sconet' => nil,
    'login' => 'erasme',
    'id_jointure_aaf' => nil,
    'nom' => 'Levallois',
    'prenom' => 'Pierre-Gilles',
    'sexe' => 'M',
    'id_ent' => 'VAA60000',
    'date_naissance' => '1970-02-06',
    'adresse' => '1 rue Sans Nom Propre',
    'code_postal' => '69000',
    'ville' => 'Lyon',
    'avatar' => '',
    'full_name' => 'Levallois Pierre-gilles',
    'profil_actif' => {
      'profil_id' => 'ENS',
      'etablissement_nom' => 'ERASME',
      'etablissement_code_uai' => '0699990Z',
      'profil_nom' => 'Enseignant',
      'profil_code_national' => 'National_ENS',
      'etablissement_id' => 1,
      'actif' => true,
      'bloque' => nil
    },
    'profils' => [
      {
        'profil_id' => 'ENS',
        'etablissement_nom' => 'ERASME',
        'etablissement_code_uai' => '0699990Z',
        'profil_nom' => 'Enseignant',
        'profil_code_national' => 'National_ENS',
        'etablissement_id' => 1,
        'actif' => true,
        'bloque' => nil
      },
      {
        'profil_id' => 'ELV',
        'etablissement_nom' => 'ERASME',
        'etablissement_code_uai' => '0699990Z',
        'profil_nom' => 'Elève',
        'profil_code_national' => 'National_ELV',
        'etablissement_id' => 1,
        'actif' => false,
        'bloque' => nil
      }
    ],
    'roles' => [
      {
        'role_id' => 'ADM_ETB',
        'etablissement_nom' => 'ERASME',
        'etablissement_code_uai' => '0699990Z',
        'etablissement_id' => 1,
        'priority' => 2,
        'libelle' => "Administrateur d'établissement"
      },
      {
        'role_id' => 'ELV_ETB',
        'etablissement_nom' => 'ERASME',
        'etablissement_code_uai' => '0699990Z',
        'etablissement_id' => 1,
        'priority' => 0,
        'libelle' => 'Elève'
      },
      {
        'role_id' => 'PROF_ETB',
        'etablissement_nom' => 'ERASME',
        'etablissement_code_uai' => '0699990Z',
        'etablissement_id' => 1,
        'priority' => 1,
        'libelle' => 'Professeur'
      },
      {
        'role_id' => 'TECH',
        'etablissement_nom' => 'ERASME',
        'etablissement_code_uai' => '0699990Z',
        'etablissement_id' => 1,
        'priority' => 3,
        'libelle' => 'Administrateur technique'
      }
    ],
    'emails' => [ ],
    'roles_max_priority_etab_actif' => 3,
    'etablissements' => [
      {
        'id' => 1,
        'nom' => 'ERASME',
        'code_uai' => '0699990Z',
        'profils' => [
          {
            'profil_id' => 'ELV',
            'user_id' => 1,
            'etablissement_id' => 1,
            'bloque' => nil,
            'actif' => false
          },
          {
            'profil_id' => 'ENS',
            'user_id' => 1,
            'etablissement_id' => 1,
            'bloque' => nil,
            'actif' => true
          }
        ],
        'roles' => [
          {
            'role_id' => 'ADM_ETB',
            'etablissement_nom' => 'ERASME',
            'etablissement_code_uai' => '0699990Z',
            'etablissement_id' => 1,
            'priority' => 2,
            'libelle' => "Administrateur d'établissement"
          },
          {
            'role_id' => 'ELV_ETB',
            'etablissement_nom' => 'ERASME',
            'etablissement_code_uai' => '0699990Z',
            'etablissement_id' => 1,
            'priority' => 0,
            'libelle' => 'Elève'
          },
          {
            'role_id' => 'PROF_ETB',
            'etablissement_nom' => 'ERASME',
            'etablissement_code_uai' => '0699990Z',
            'etablissement_id' => 1,
            'priority' => 1,
            'libelle' => 'Professeur'
          },
          {
            'role_id' => 'TECH',
            'etablissement_nom' => 'ERASME',
            'etablissement_code_uai' => '0699990Z',
            'etablissement_id' => 1,
            'priority' => 3,
            'libelle' => 'Administrateur technique'
          }
        ]
      },
      {
        'id' => 2,
        'nom' => 'CLG VAL D ARGENT',
        'code_uai' => '0699980K',
        'profils' => [
          {
            'profil_id' => 'ELV',
            'user_id' => 1,
            'etablissement_id' => 2,
            'bloque' => nil,
            'actif' => false
          },
          {
            'profil_id' => 'ENS',
            'user_id' => 1,
            'etablissement_id' => 2,
            'bloque' => nil,
            'actif' => true
          }
        ],
        'roles' => [
          {
            'role_id' => 'ADM_ETB',
            'etablissement_nom' => 'CLG VAL D ARGENT',
            'etablissement_code_uai' => '0699980K',
            'etablissement_id' => 2,
            'priority' => 2,
            'libelle' => "Administrateur d'établissement"
          }
        ]
      }
    ],
    'classes' => [
      {
        'etablissement_code' => '0699990Z',
        'classe_libelle' => '6B',
        'etablissement_nom' => "ERASME",
        'matiere_enseignee_id' => '003700',
        'matiere_libelle' => 'AIDE ET ACCOMPAGNEMENT TRAVAIL PERSONNEL',
        'classe_id' => 1,
        'etablissement_id' => 1,
        'prof_principal' => 'N'
      },
      {
        'etablissement_code' => '0699990Z',
        'classe_libelle' => '5A',
        'etablissement_nom' => "ERASME",
        'matiere_enseignee_id' => '003700',
        'matiere_libelle' => 'AIDE ET ACCOMPAGNEMENT TRAVAIL PERSONNEL',
        'classe_id' => 5,
        'etablissement_id' => 1,
        'prof_principal' => 'N'
      },
      {
        'etablissement_code' => '0699990Z',
        'classe_libelle' => '5A',
        'etablissement_nom' => "ERASME",
        'matiere_enseignee_id' => '003800',
        'matiere_libelle' => 'MATHEMATIQUES',
        'classe_id' => 5,
        'etablissement_id' => 1,
        'prof_principal' => 'N'
      },
      {
        'etablissement_code' => '0699980K',
        'classe_libelle' => '4C',
        'etablissement_nom' => "CLG VAL D ARGENT",
        'matiere_enseignee_id' => '003800',
        'matiere_libelle' => 'MATHEMATIQUES',
        'classe_id' => 18,
        'etablissement_id' => 2,
        'prof_principal' => 'N'
      }
    ],
    'telephones' => [ ],
    'groupes_eleves' => [
      {
        'etablissement_code' => '0699990Z',
        'groupe_id' => 609,
        'groupe_libelle' => 'GROUPE 1 BACASABLE',
        'etablissement_nom' => 'ERASME',
        'etablissement_id' => 1
      },
      {
        'etablissement_code' => '0699990Z',
        'groupe_id' => 610,
        'groupe_libelle' => 'GROUPE 2 BACASABLE',
        'etablissement_nom' => 'ERASME',
        'etablissement_id' => 1
      }
    ],
    'groupes_libres' => [ ],
    'parents' => [ ],
    'enfants' => [ ],
    'relations_eleves' => [ ],
    'relations_adultes' => [ ]
  }

PERSONNELS_DATA = [
  {
    "id"=>1,
    "id_ent"=>"VAA60001",
    "nom"=>"Levallois",
    "prenom"=>"Pierre-Gilles",
    "profil_id"=>"ENS",
    "description"=>nil,
    "etablissement_id"=>1,
    "code_national"=>"National_ENS",
    "libelle"=>nil,
    "email_principal"=>"pierre-gilles.levallois@v3dev.laclasse.com",
    "emails"=>[
        {
            "id"=>38956,
            "adresse"=>"pierre-gilles.levallois@v3dev.laclasse.com",
            "principal"=>"1"
        }
    ],
    "roles"=>[
        {
            "role_id"=>"ADM_ETB",
            "libelle"=>"Administrateur d'établissement"
        },
        {
            "role_id"=>"PROF_ETB",
            "libelle"=>"Professeur"
        },
        {
            "role_id"=>"TECH",
            "libelle"=>"Administrateur technique"
        },
        {
            "role_id"=>"ELV_ETB",
            "libelle"=>"Elève"
        }
    ]
},{
    "id"=>1349,
    "id_ent"=>"VBM69696",
    "nom"=>"Le%20Moine",
    "prenom"=>"Gwenhael",
    "profil_id"=>"ENS",
    "description"=>nil,
    "etablissement_id"=>1,
    "code_national"=>"National_ENS",
    "libelle"=>nil,
    "email_principal"=>"gwenhael.le20moine@v3dev.laclasse.com",
    "emails"=>[
        {
            "id"=>22807,
            "adresse"=>"gwenhael.le20moine@v3dev.laclasse.com",
            "principal"=>"1"
        }
    ],
    "roles"=>[
        {
            "role_id"=>"ADM_ETB",
            "libelle"=>"Administrateur d'établissement"
        },
        {
            "role_id"=>"ELV_ETB",
            "libelle"=>"Elève"
        },
        {
            "role_id"=>"TECH",
            "libelle"=>"Administrateur technique"
        },
        {
            "role_id"=>"PROF_ETB",
            "libelle"=>"Professeur"
        },
        {
            "role_id"=>"AVS_ETB",
            "libelle"=>"Assistance vie scolaire"
        }
    ]
},{
    "id"=>1351,
    "id_ent"=>"VBP69926",
    "nom"=>"Quenin",
    "prenom"=>"Hadrien",
    "profil_id"=>"ETA",
    "description"=>nil,
    "etablissement_id"=>1,
    "code_national"=>"National_ETA",
    "libelle"=>nil,
    "email_principal"=>"hadrien.quenin@v3dev.laclasse.com",
    "emails"=>[
        {
            "id"=>22809,
            "adresse"=>"hadrien.quenin@v3dev.laclasse.com",
            "principal"=>"1"
        }
    ],
    "roles"=>[
        {
            "role_id"=>"ELV_ETB",
            "libelle"=>"Elève"
        },
        {
            "role_id"=>"PROF_ETB",
            "libelle"=>"Professeur"
        },
        {
            "role_id"=>"TECH",
            "libelle"=>"Administrateur technique"
        }
    ]
},{
    "id"=>9488,
    "id_ent"=>"VAH67684",
    "nom"=>"Leroy",
    "prenom"=>"Hélène",
    "profil_id"=>"ETA",
    "description"=>nil,
    "etablissement_id"=>1,
    "code_national"=>"National_ETA",
    "libelle"=>nil,
    "email_principal"=>"helene.leroy@v3dev.laclasse.com",
    "emails"=>[
        {
            "id"=>39754,
            "adresse"=>"helene.leroy@v3dev.laclasse.com",
            "principal"=>"1"
        }
    ],
    "roles"=>[
        {
            "role_id"=>"ADM_ETB",
            "libelle"=>"Administrateur d'établissement"
        },
        {
            "role_id"=>"TECH",
            "libelle"=>"Administrateur technique"
        },
        {
            "role_id"=>"PROF_ETB",
            "libelle"=>"Professeur"
        }
    ]
},{
    "id"=>9489,
    "id_ent"=>"VZL64459",
    "nom"=>" Rosette",
    "prenom"=>"Eva",
    "profil_id"=>"ENS",
    "description"=>"ANGLAIS",
    "etablissement_id"=>1,
    "code_national"=>"National_ENS",
    "libelle"=>"ENSEIGNEMENT",
    "email_principal"=>"eva.-rosette@v3dev.laclasse.com",
    "emails"=>[
        {
            "id"=>39756,
            "adresse"=>"eva.-rosette@v3dev.laclasse.com",
            "principal"=>"1"
        }
    ],
    "roles"=>[
        {
            "role_id"=>"PROF_ETB",
            "libelle"=>"Professeur"
        }
    ]
},{
    "id"=>9490,
    "id_ent"=>"VZL64455",
    "nom"=>"Benaissa",
    "prenom"=>"Youcef",
    "profil_id"=>"DOC",
    "description"=>"DOCUMENTATION",
    "etablissement_id"=>1,
    "code_national"=>"National_DOC",
    "libelle"=>"DOCUMENTATION",
    "email_principal"=>"youcef.benaissa@v3dev.laclasse.com",
    "emails"=>[
        {
            "id"=>39758,
            "adresse"=>"youcef.benaissa@v3dev.laclasse.com",
            "principal"=>"1"
        }
    ],
    "roles"=>[
        {
            "role_id"=>"PROF_ETB",
            "libelle"=>"Professeur"
        }
    ]
},{
    "id"=>9496,
    "id_ent"=>"VZL64444",
    "nom"=>"COSSART",
    "prenom"=>"Anne-sophie",
    "profil_id"=>"ENS",
    "description"=>nil,
    "etablissement_id"=>1,
    "code_national"=>"National_ENS",
    "libelle"=>nil,
    "email_principal"=>"anne-sophie.cossart@v3dev.laclasse.com",
    "emails"=>[
        {
            "id"=>39772,
            "adresse"=>"anne-sophie.cossart@v3dev.laclasse.com",
            "principal"=>"1"
        }
    ],
    "roles"=>[
        {
            "role_id"=>"PROF_ETB",
            "libelle"=>"Professeur"
        }
    ]
},{
    "id"=>9501,
    "id_ent"=>"VZL64467",
    "nom"=>"ghffgfg",
    "prenom"=>"Fgffgh",
    "profil_id"=>"ENS",
    "description"=>"ARTS PLASTIQUES",
    "etablissement_id"=>1,
    "code_national"=>"National_ENS",
    "libelle"=>"ENSEIGNEMENT",
    "email_principal"=>"fgffgh.ghffgfg@v3dev.laclasse.com",
    "emails"=>[
        {
            "id"=>39784,
            "adresse"=>"fgffgh.ghffgfg@v3dev.laclasse.com",
            "principal"=>"1"
        }
    ],
    "roles"=>[
        {
            "role_id"=>"PROF_ETB",
            "libelle"=>"Professeur"
        }
    ]
},{
    "id"=>9504,
    "id_ent"=>"VZL64448",
    "nom"=>"LEROY",
    "prenom"=>"H&%23233%20l&%23232%20ne",
    "profil_id"=>"ENS",
    "description"=>"MATHEMATIQUES",
    "etablissement_id"=>1,
    "code_national"=>"National_ENS",
    "libelle"=>"ENSEIGNEMENT",
    "email_principal"=>"h233-l232-ne.leroy@v3dev.laclasse.com",
    "emails"=>[
        {
            "id"=>39792,
            "adresse"=>"h233-l232-ne.leroy@v3dev.laclasse.com",
            "principal"=>"1"
        }
    ],
    "roles"=>[
        {
            "role_id"=>"PROF_ETB",
            "libelle"=>"Professeur"
        },
        {
            "role_id"=>"TECH",
            "libelle"=>"Administrateur technique"
        }
    ]
},
{
    "id"=>9526,
    "id_ent"=>"VAC68800",
    "nom"=>"Yviquel",
    "prenom"=>"Catherine",
    "profil_id"=>"ENS",
    "description"=>nil,
    "etablissement_id"=>1,
    "code_national"=>"National_ENS",
    "libelle"=>nil,
    "email_principal"=>"catherine.yviquel@v3dev.laclasse.com",
    "emails"=>[
        {
            "id"=>39847,
            "adresse"=>"catherine.yviquel@v3dev.laclasse.com",
            "principal"=>"1"
        }
    ],
    "roles"=>[
        {
            "role_id"=>"PROF_ETB",
            "libelle"=>"Professeur"
        }
    ]
}
]
