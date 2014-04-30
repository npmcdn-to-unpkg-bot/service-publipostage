#coding: utf-8
#
# model for 'regroupement' table
# generated 2012-04-19 17:45:32 +0200 by model_generator.rb
#
# ------------------------------+---------------------+----------+----------+------------+--------------------
# COLUMN_NAME                   | DATA_TYPE           | NULL?    | KEY      | DEFAULT    | EXTRA
# ------------------------------+---------------------+----------+----------+------------+--------------------
# id                            | int(11)             | false    | PRI      |            | auto_increment
# libelle                       | varchar(45)         | true     |          |            | 
# description                   | text                | true     |          |            | 
# code_mef_aaf                  | int(11)             | true     |          |            | 
# date_last_maj_aaf             | date                | true     |          |            | 
# libelle_aaf                   | char(8)             | true     |          |            | 
# etablissement_id              | int(11)             | true     | MUL      |            | 
# type_regroupement_id          | char(8)             | false    | MUL      |            | 
# ------------------------------+---------------------+----------+----------+------------+--------------------
#
class Regroupement < Sequel::Model(:regroupement)

  # Plugins
  plugin :validation_helpers
  plugin :json_serializer

  # Referential integrity
  many_to_one :etablissement
  one_to_many :enseigne_dans_regroupement
  many_to_one :niveau
  one_to_many :eleve_dans_regroupement

  # Not nullable cols
  def validate
    super
    validates_presence [:type_regroupement_id]
    # validates presence :etablissemnet_id if type_regroupement is CLS, GRP
    validates_presence [:code_mef_aaf] if :type_regroupement_id == 'CLS'
  end

  def before_destroy
    # Supprimera toutes les ressources liées à ce regroupement
    self.ressource.destroy() if self.ressource
    # Supprime tous les enseignements effectués dans ce regroupement
    enseigne_dans_regroupement_dataset.destroy()
    super
  end

  #Les regroupement de type classe ont forcément un niveau
  def niveau
    if !self.code_mef_aaf.nil?
      Niveau[self.code_mef_aaf].mef_libelle
    else
      nil
    end
  end

  def nb_membres
    RoleUser.filter(:ressource => self.ressource).unique(:user_id)
  end

  def is_classe
    type_regroupement_id == TYP_REG_CLS 
  end

  def is_groupe
    type_regroupement_id == TYP_REG_GRP 
  end  

  # Liste des membres du regroupement dont le profil est Prof
  def profs
    DB[:user].filter(:id => DB[:enseigne_dans_regroupement].filter(:regroupement_id => self.id).select(:user_id))
    .join(:profil_user, :profil_user__user_id => :id).filter(:profil_id => 'ENS').naked.all
=begin
      User.filter(:enseigne_dans_regroupement => EnseigneDansRegroupement.filter(:regroupement => self),
      :profil_user => ProfilUser.filter(:etablissement_id => etablissement_id, :profil_id => 'ENS'))
      .map{|u| {
        :user_id => u.id, 
        :id_ent => u.id_ent, 
        :id_jointure_aaf => u.id_jointure_aaf,
        :nom => u.nom, 
        :prenom => u.prenom, 
        :prof_principal => u.prof_principal(self.id),
        :matieres => u.matiere_enseigne(self.id)}} 
=end
  end
  # Liste des membres du regroupement dont le profil est élève
  def eleves
    DB[:user].filter(:id => DB[:eleve_dans_regroupement].filter(:regroupement_id => self.id).select(:user_id))
    .join(:profil_user, :profil_user__user_id => :id).filter(:profil_id => 'ELV').naked.all
  end
end
