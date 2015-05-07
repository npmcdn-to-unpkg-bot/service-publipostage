module API
  module Entities
    #
    # FIXME: Entity for Publipostage
    #
    class PublipostageEntity < Grape::Entity
      expose :id
      expose :message
      expose :descriptif
      expose :date
      expose :message_type
      expose :destinataires do |publi, _options|
        publi.destinataires
      end
    end
  end
end
