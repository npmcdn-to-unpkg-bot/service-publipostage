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
    if params.has_key?('descriptif') and params.has_key?('message')
      # new Publi
      publi = Publipostage.create(:descriptif => params['descriptif'], :message => params['message'],:date => DateTime.now)
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
end