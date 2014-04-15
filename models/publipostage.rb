#coding: utf-8
#
# model for 'publipostage' table
# ------------------------------+---------------------+----------+----------+------------+--------------------
# COLUMN_NAME                   | DATA_TYPE           | NULL?    | KEY      | DEFAULT    | EXTRA
# ------------------------------+---------------------+----------+----------+------------+--------------------
# id                            | int                 | false    | PRI      |            | 
# date                          | DateTime            | true     |          |            | 
# descriptif                    | varchar(45)         | true     |          |            | 
# code_men                      | varchar(45)         | true     |          |            | 
# ------------------------------+---------------------+----------+----------+------------+--------------------

# profil_id deleted in the new version
# profil_id                     | char(8)             | false    | MUL      |            | 

#
class Publipostage < Sequel::Model(:publipostage)

  # Plugins
  plugin :validation_helpers
  plugin :json_serializer

  unrestrict_primary_key()

  # Referential integrity
  one_to_many :destinataire

  # Not nullable cols
  def validate
    super
  end
end