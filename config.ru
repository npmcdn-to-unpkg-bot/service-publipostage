# -*- encoding: utf-8 -*-

$LOAD_PATH.unshift(File.dirname(__FILE__))

require './config/init'

require 'app'

require 'laclasse/laclasse_logger'
require 'laclasse/helpers/rack'

require './api/init.rb'

use Rack::Rewrite do
  rewrite %r{^#{APP_PATH}(/(bower_components|fonts|images|scripts|styles|views)/.*(map|css|js|ttf|woff|html|png|jpg|jpeg|gif|svg)[?v=0-9a-zA-Z\-.]*$)}, '/app$1'
end

LOGGER = Laclasse::LoggerFactory.get_logger
LOGGER.info( "Démarrage du publipostage avec #{LOGGER.loggers_count} logger#{LOGGER.loggers_count > 1 ? 's': ''}" )

Laclasse::Helpers::Rack.configure_rake self if defined? REDIS

use OmniAuth::Builder do
    configure do |config|
      config.path_prefix =  APP_PATH + '/auth'
    end
    provider :cas,  CASAUTH::CONFIG
end

run Rack::URLMap.new( "#{APP_PATH}/api" => ApplicationAPI.new,
                      "/" => SinatraApp.new )
