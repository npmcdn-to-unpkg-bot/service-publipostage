# coding: utf-8

require 'rubygems'
require 'bundler'
require "sinatra/reloader"

require './config/init'
require './lib/init.rb'
Bundler.require( :default, ENV['RACK_ENV'].to_sym )     # require tout les gems définis dans Gemfile

#require_relative './lib/AuthenticationHelpers'



# https://gist.github.com/chastell/1196800
class Hash
  def to_html
    [ '<ul>',
     map { |k, v| ["<li><strong>#{k}</strong> : ", v.respond_to?(:to_html) ? v.to_html : "<span>#{v}</span></li>"] },
     '</ul>'
    ].join
  end
end

# Application Sinatra servant de base
class SinatraApp < Sinatra::Base

  configure do
  set :app_file, __FILE__
  set :root, APP_ROOT
  set :public_folder, Proc.new { File.join(root, "public") }
  set :inline_templates, true
  set :protection, true
  end

  configure :development do
  register Sinatra::Reloader
  #also_reload '/path/to/some/file'
  #dont_reload '/path/to/other/file'
  end

  Annuaire.configure do |config|
    config.app_id = ANNUAIRE[:app_id]
    config.secret = ANNUAIRE[:secret]
  end

  helpers AuthenticationHelpers

  get APP_PATH + '/' do
    # show/hide toolbar
    if params['navbar'] == 'true' || params['navbar'].nil?
      env["show_navbar"] = true
    else
      env["show_navbar"] = false
    end
    if is_logged?
      erb :app
    else
      erb :public_page
    end  
  end

  get APP_PATH + '/auth/:provider/callback' do
    init_session( request.env )
    redirect params[:url] if params[:url] !=  env['rack.url_scheme'] + "://" + env['HTTP_HOST'] + APP_PATH + '/'
    redirect APP_PATH + '/'
  end

  get APP_PATH + '/auth/failure' do
    erb "<h1>Authentication Failed:</h1><h3>message:<h3> <pre>#{params}</pre>"
  end

  get APP_PATH + '/auth/:provider/deauthorized' do
    erb "#{params[:provider]} has deauthorized this app."
  end

  get APP_PATH + '/protected' do
    throw(:halt, [401, "Not authorized\n"]) unless session[:authenticated]
    erb "<pre>#{request.env['omniauth.auth'].to_json}</pre><hr>
       <a href='<%= APP_PATH %>/logout'>Logout</a>"
  end

  get APP_PATH + '/login' do
    login! APP_PATH + '/'
  end

  get APP_PATH + '/logout' do
    logout! (env['rack.url_scheme'] + "://" + env['HTTP_HOST'] + APP_PATH + '/')
  end

  get APP_PATH + '/current-user' do
    if is_logged?
       data = env['rack.session'][:current_user]
       user_detail = Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_user] + data[:info]['uid'], {})
       {:login => data[:user],
         :info => data[:info],
         :roles => data[:info]['ENTPersonRoles'].split(',').map{|role| role.split(':')},
         :roles_max_priority_etab_actif => user_detail['roles_max_priority_etab_actif']
       }.to_json
    else
       nil
    end 
  end
end

SinatraApp.run! if __FILE__ == $PROGRAM_NAME
