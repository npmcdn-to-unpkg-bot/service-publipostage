#coding: utf-8
#
# model for 'publipostage' table
# ------------------------------+---------------------+----------+----------+------------+--------------------
# COLUMN_NAME                   | DATA_TYPE           | NULL?    | KEY      | DEFAULT    | EXTRA
# ------------------------------+---------------------+----------+----------+------------+--------------------
# id                            | int                 | false    | PRI      |            | 
# date                          | DateTime            | true     |          |            | 
# descriptif                    | varchar(45)         | true     |          |            | 
# message                       | MEDIUMTEXT          | true     |          |            | 
# ------------------------------+---------------------+----------+----------+------------+--------------------
class Publipostage < Sequel::Model(:publipostage)

  # Plugins
  plugin :validation_helpers
  plugin :json_serializer

  unrestrict_primary_key()

  # Referential integrity
  one_to_many :destinataires

  # Not nullable cols
  def validate
    super
  end
end