#coding: utf-8
#
# model for 'destinataire' table
# ------------------------------+---------------------+----------+----------+------------+--------------------
# COLUMN_NAME                   | DATA_TYPE           | NULL?    | KEY      | DEFAULT    | EXTRA
# ------------------------------+---------------------+----------+----------+------------+--------------------
# etablissement_code_uai        | varchare            | false    | PRI      |            | 
# regroupement_id               | INT                 | false    | PRI      |            | 
# publpostage_id                | INT                 | true     | PRI      |            | 
# ------------------------------+---------------------+----------+----------+------------+--------------------

class Destinataire < Sequel::Model(:destinataires)

  # Plugins
  plugin :validation_helpers
  plugin :json_serializer

  unrestrict_primary_key()

  # Referential integrity
  many_to_one :regroupement
  many_to_one :publipostage

  # Not nullable cols
  def validate
    super
  end
end