# coding: utf-8
require 'sinatra/base'
require 'json'
require_relative '../lib/AuthenticationHelpers'

class Api < Sinatra::Base
  error 403 do
    'Access forbidden'
  end
  
  error 401 do
    'Not authenticated'
  end
  
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
    if params.has_key?('descriptif') and params.has_key?('message')
      # new Publi
      publi = Publipostage.create(:descriptif => params['descriptif'], :message => params['message'],:date => DateTime.now)
      publi
    else
      error 400
    end
  end

  put '/publipostages/:id' do
    
  end
  
  delete '/publipostages/:id' do
    #'ok'
    content_type :json
    Publipostage.where(:id => params['id']).destroy
  end
end