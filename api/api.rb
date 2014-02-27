# coding: utf-8
require 'sinatra/base'
require 'json'
class Api < Sinatra::Base
  get "/publipostages" do
    content_type :json
    response = Publipostage.naked.all
    response.to_json
  end
  
  get '/publipostages/:id' do
    content_type :json
    Publipostage[:id => params['id']].to_json
  end
 
  post '/publipostages' do
    content_type :json
    if params.has_key?('date') and params.has_key?('descriptif') and params.has_key?('message')
      # new Publi
    end
  end

  put '/publipostages/:id' do
    
  end
  
  delete '/color/:id' do
    content_type :json
    Publipostage.where(:id => params['id']).destroy
  end
end