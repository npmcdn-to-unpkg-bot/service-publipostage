module API
  	module Entities
	    class PublipostageEntity < Grape::Entity
	      expose :id
	      expose :message
	      expose :descriptif
	      expose :date
	      expose :destinataires do |publi, options|
	      	publi.destinataire
	      end
	    end
 	end
end