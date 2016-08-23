# coding: utf-8

# Librairies pour l'application
module Publipostage
  # Module pour le traitement du publiposte
  # rubocop:disable Metrics/AbcSize
  module Utils
    module_function

    # tri les infos de l'utilisateur pour n'en ressortir que les regroupements
    def self.get_regroupements( user_infos )
      # S'il n'y a pas d'établissement, pas la peine de continuer !
      return [] if user_infos.nil? || user_infos['etablissements'].nil?

      regroupements = []
      unless user_infos['classes'].nil?
        regroupements += user_infos['classes'].uniq { |classe| classe['classe_id'] }
                                              .select { |classe| user_infos['profil_actif']['etablissement_id'] == classe['etablissement_id'] }
                                              .map do |classe|
          classe['id'] = classe['classe_id']
          classe['libelle'] = classe['classe_libelle']
          classe['type'] = 'classe'
          classe['destinataire_libelle'] = classe['classe_libelle']

          classe
        end
      end

      unless user_infos['groupes_eleves'].nil?
        regroupements += user_infos['groupes_eleves'].uniq { |groupe| groupe['groupe_id'] }
                                                     .select { |groupe| user_infos['profil_actif']['etablissement_id'] == groupe['etablissement_id'] }
                                                     .map do |groupe|
          groupe['id'] = groupe['groupe_id']
          groupe['libelle'] = groupe['groupe_libelle']
          groupe['type'] = 'groupe'
          groupe['destinataire_libelle'] = groupe['groupe_libelle']

          groupe
        end
      end

      { etablissements: user_infos['etablissements'].uniq { |etab| { id: etab['id'], nom: etab['nom'] } }
                                                    .map { |etab| { id: etab['id'], nom: etab['nom'] } },
        regroupements: regroupements }
    end

    # fonction qui récupère les infos nécéssaire de la requête
    def self.get_personnels( user_infos )
      user_infos.map do |personnel|
        personnel['destinataire_libelle'] = personnel['nom'] + ' ' + personnel['prenom']
        personnel
      end
    end

    def self.get_matiere_string( params )
      'professors' == params[:population] && params.key?( :matiere ) && params[:matiere] != '-1' ? "/#{params[:matiere]}" : ''
    end
  end
  # rubocop:enable Metrics/AbcSize
end
