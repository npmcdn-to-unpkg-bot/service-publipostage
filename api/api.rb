# coding: utf-8
require 'grape'

class API < Grape::API
  format :json
  
  desc "Retourner la listes des publipostage"
  get "/publipostages" do
    response = Publipostage.naked.all
    response
  end
  
  
  desc "Retourner un  publipostage par id"
  get '/publipostages/:id' do
    Publipostage[:id => params['id']]
  end
 
  desc "creer un nouveau publipostag" 
  post '/publipostages' do
    if params.has_key?('descriptif') and params.has_key?('message') and params.has_key?('destinataires')
      # new Publi
      puts params['destinataires'].inspect
      publi = Publipostage.create(:descriptif => params['descriptif'], :message => params['message'], 
                                  :date => DateTime.now)
      destinations = params['destinataires']
      destinations.each do |d|
        puts d.inspect
      end
      destinations.each do |dest|
        if dest.respond_to?('classe_id')
          Destinataire.create(:etablissement_code_uai => dest.etablissement_code , :regroupement_id => dest.classe_id, :publipostage_id => publi.id)
        elsif dest.respond_to?('groupe_id')
          Destinataire.create(:etablissement_code_uai => dest.etablissement_code , :regroupement_id => dest.groupe_id, :publipostage_id => publi.id)
        else
           "error"
        end
      end
      publi
    else
      error!('Mauvaise requête', 400)
    end
  end

  desc "modifier un publipostage"
  put '/publipostages/:id' do
    
  end

  desc "supprimer un publipostage"
  delete '/publipostages/:id' do
    Publipostage.where(:id => params['id']).destroy
  end

  desc "retourner la liste des profil"
  get '/profils' do
    Annuaire.get_profils()
  end

  desc "retourner les info de l'utilisateur"
  get '/user/:id' do
    Annuaire.get_user(params[:id])
  end

  desc "retourner les regroupements d'un utilisateur"
  get "/regroupements/:id" do
    Annuaire.get_regroupements(params[:id])
  end

end