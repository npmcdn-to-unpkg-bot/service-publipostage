#coding: utf-8
#
# include file to access all models
# generated 2012-05-21 18:00:26 +0200 by model_generator.rb
#

# MODELS
require_relative 'publipostage'
require_relative 'destinataires'
require_relative 'regroupement'

#On fait manuellement l'association table=>model car elle est impossible a faire automatiquement
#(pas de lien 1<=>1 entre dataset et model stackoverflow 9408785)
MODEL_MAP = {}
DB.tables.each do |table|
  capitalize_name = table.to_s.split(/[^a-z0-9]/i).map{|w| w.capitalize}.join
  begin 
    MODEL_MAP[table] = Kernel.const_get(capitalize_name)
  rescue => e
    puts e.message
  end
end