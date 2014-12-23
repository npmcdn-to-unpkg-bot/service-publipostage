# -*- encoding: utf-8 -*-

$LOAD_PATH.unshift(File.dirname(__FILE__))
require './config/init'
require 'app'
require './api/init.rb'

use Rack::Rewrite do
  #rewrite %r{/app/.*(css|js)/(.*)}, '/$1/$2'
  #rewrite %{/app/app/.*/.*}, '/app/$1/$2'
  rewrite %r{^#{APP_PATH}(/(bower_components|fonts|images|scripts|styles|views)/.*(map|css|js|ttf|woff|html|png|jpg|jpeg|gif|svg)[?v=0-9a-zA-Z\-.]*$)}, '/app$1'
end

require 'rack/session/redis'
use Rack::Session::Redis,
    key: 'rack.session',
    path: '/',
    expire_after: 3600, # In seconds
    redis_server: "redis://#{REDIS[:host]}:#{REDIS[:port]}/0/#{REDIS[:redis_root]}-rack:session"

use OmniAuth::Builder do
    configure do |config|
      config.path_prefix =  APP_PATH + '/auth'
    end
    provider :cas,  CASAUTH::CONFIG
end
run Rack::URLMap.new(
                      "#{APP_PATH}/api" => ApplicationAPI.new,
                      "/" => SinatraApp.new)
#run SinatraApp
