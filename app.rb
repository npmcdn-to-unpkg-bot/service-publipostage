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

  get "#{APP_PATH}/" do
    if logged?
      erb :app
    else
      login! "#{APP_PATH}/"
    end
  end

  get "#{APP_PATH}/status" do
    content_type :json

    app_status = app_infos

    app_status[:status] = 'OK'
    app_status[:reason] = 'L\'application fonctionne.'

    app_status.to_json
  end

  get "#{APP_PATH}/auth/:provider/callback" do
    init_session( request.env )
    redirect params[:url] if params[:url] != "#{env['rack.url_scheme']}://#{env['HTTP_HOST']}#{APP_PATH}/"
    redirect "#{APP_PATH}/"
  end

  get "#{APP_PATH}/auth/failure" do
    erb "<h1>Authentication Failed:</h1><h3>message:<h3> <pre>#{params}</pre>"
  end

  get "#{APP_PATH}/auth/:provider/deauthorized" do
    erb "#{params[:provider]} has deauthorized this app."
  end

  get "#{APP_PATH}/protected" do
    throw(:halt, [401, "Not authorized\n"]) unless session[:authenticated]
    erb "<pre>#{request.env['omniauth.auth'].to_json}</pre><hr>
       <a href='<%= APP_PATH %>/logout'>Logout</a>"
  end

  get "#{APP_PATH}/login" do
    login! "#{APP_PATH}/"
  end

  get "#{APP_PATH}/logout" do
    logout!( "#{env['rack.url_scheme']}://#{env['HTTP_HOST']}#{APP_PATH}/" )
  end

  get "#{APP_PATH}/current-user" do
    # TODO : This function should be in Laclasse-common
    if logged?
      is_super_admin = user[:user_detailed]['roles'].count { |role| role['role_id'] == 'TECH' } > 0
      data = env['rack.session'][:current_user]
      { login: data[:user],
        info: data[:info],
        roles: data[:info]['ENTPersonRoles'].split(',').map { |role| role.split(':') },
        is_admin: user_is_admin?,
        is_super_admin: is_super_admin
      }.to_json
    end
  end
end

SinatraApp.run! if __FILE__ == $PROGRAM_NAME
