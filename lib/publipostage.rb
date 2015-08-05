# coding: utf-8

# Librairies pour l'application
module Lib
  # Module pour le traitement du publiposte
  # rubocop:disable Metrics/AbcSize
  module Publipostage
    module_function

    # tri les infos de l'utilisateur pour en ressortir que les regroupements
    def self.get_regroupements(user_infos)
      if !user_infos.nil?
        etablissements = []
        regroupements = []
        user_infos['etablissements'].each do |etab|
          etablissements.push(id: etab['id'], nom: etab['nom']) unless etablissements.include?(id: etab['id'], nom: etab['nom'])
        end
        user_infos['classes'].uniq { |classe| classe['classe_id'] }.each do |classe|
          classe['id'] = classe['classe_id']
          classe['libelle'] = classe['classe_libelle']
          classe['type'] = 'classe'
          classe['destinataire_libelle'] = classe['classe_libelle']
          # uniquement les regroupements du profil actif
          regroupements.push(classe) if user_infos['profil_actif']['etablissement_id'] == classe['etablissement_id']
        end
        user_infos['groupes_eleves'].uniq { |groupe| groupe['groupe_id'] }.each do |groupe|
          groupe['id'] = groupe['groupe_id']
          groupe['libelle'] = groupe['groupe_libelle']
          groupe['type'] = 'groupe'
          groupe['destinataire_libelle'] = groupe['groupe_libelle']
          # uniquement les regroupements du profil actif
          regroupements.push(groupe) if user_infos['profil_actif']['etablissement_id'] == groupe['etablissement_id']
        end
        { etablissements: etablissements, regroupements: regroupements}
      else
        return []
      end
    end

    # fonction qui récupère les infos nécéssaire de la requête
    def self.get_personnels(personnels_infos)
      personnels = []
      personnels_infos.each do |personnel|
        personnel['destinataire_libelle'] = personnel['nom'] + ' ' + personnel['prenom']
        personnels << personnel
      end
      personnels
    end

    def self.get_matiere_string(params)
      ('professors' == params[:population] && !params[:matiere].nil? && params[:matiere] != '-1' ) ? '/' + params[:matiere] : ''
    end
  end
  # rubocop:enable Metrics/AbcSize

end
