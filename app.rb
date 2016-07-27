# coding: utf-8

require 'rubygems'
require 'bundler'

Bundler.require( :default, ENV['RACK_ENV'].to_sym ) # require tout les gems définis dans Gemfile

require 'tilt/erb'

require 'laclasse/helpers/authentication'
require 'laclasse/helpers/app_infos'
require 'laclasse/helpers/user'

# Application Sinatra servant de base
class SinatraApp < Sinatra::Base
  configure do
    set :app_file, __FILE__
    set :root, APP_ROOT
    set :public_folder, proc { File.join(root, 'public') }
    set :inline_templates, true
    set :protection, true
  end

  helpers Laclasse::Helpers::Authentication
  helpers Laclasse::Helpers::AppInfos
  helpers Laclasse::Helpers::User

  get "#{APP_PATH}/status" do
    content_type :json

    app_status = app_infos

    app_status[:status] = 'OK'
    app_status[:reason] = 'L\'application fonctionne.'

    app_status.to_json
  end

  before do
    pass if %r{#{APP_PATH}/(auth|login|status)/} =~ request.path
    login!( request.path_info ) unless logged?
    throw( :halt, [ 401, erb( :message_401 ) ] ) if FORBIDDEN_PROFILES.include?( user[:user_detailed]['profil_actif']['profil_id'] )
  end

  get "#{APP_PATH}/?" do
    erb :app
  end

  get "#{APP_PATH}/auth/:provider/callback" do
    init_session( request.env )
    redirect( params[:url] ) if params[:url] != "#{env['rack.url_scheme']}://#{env['HTTP_HOST']}#{APP_PATH}/"
    redirect( "#{APP_PATH}/" )
  end

  get "#{APP_PATH}/auth/failure" do
    erb "<h1>Authentication Failed:</h1><h3>message:<h3> <pre>#{params}</pre>"
  end

  get "#{APP_PATH}/auth/:provider/deauthorized" do
    erb "#{params[:provider]} has deauthorized this app."
  end

  get "#{APP_PATH}/protected" do
    throw(:halt, [401, "Not authorized\n"]) unless session[:authenticated]
    erb "<pre>#{request.env['omniauth.auth'].to_json}</pre><hr><a href='<%= APP_PATH %>/logout'>Logout</a>"
  end

  get "#{APP_PATH}/login" do
    login! "#{APP_PATH}/"
  end

  get "#{APP_PATH}/logout" do
    logout!( "#{env['rack.url_scheme']}://#{env['HTTP_HOST']}#{APP_PATH}/" )
  end

  get "#{APP_PATH}/current-user" do
    { login: user[:user],
      info: user[:info],
      roles: user[:user_detailed]['roles'].map { |role| role['role_id'] }.uniq,
      is_admin: user_is_admin?,
      is_super_admin: user_is_super_admin? }.to_json
  end
end

SinatraApp.run! if __FILE__ == $PROGRAM_NAME
