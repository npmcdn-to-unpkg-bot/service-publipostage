# encoding: utf-8
# -*- coding: utf-8 -*-

module EmailGenerator
	Nodes = ['civilite', 'date', 'nom', 'prenom', 'nomEleve', 'prenomEleve', 'adresse', 'signature']
	def EmailGenerator.send_emails(message, destinataires, profil)
		puts "profil is #{profil}"
		Mail.defaults do
  		#delivery_method :smtp, address: "localhost", port: 25, openssl_verify_mode => OpenSSL::SSL::VERIFY_NONE
  		delivery_method :test
		end
		Mail::TestMailer.deliveries
		final_document = ""
		destinataires.each do |dest|
	      	regroupement = dest.regroupement_dataset.first
	      	case profil 
	      	when 'parents'
	      		membres = regroupement.parents
	      	when 'eleves'
	      		membres = regroupement.eleves
	      	when 'profs'
	      		membres = regroupement.profs
	      	end
	      	membres.each do |membre|
	      		#puts membre.email
		        html = HTMLEntities.new.decode message
		        document = Nokogiri::HTML(html)
		        #loop over nodes 
		        Nodes.each do |node_name|
		          nodes = document.css(node_name)
		          nodes.each do |node|
		            #node = document.at_css(node_name)
		            # mockup data
		            if !node.nil?
		              case node_name
		              when 'civilite'
		                # match spaces
		                match = node.content.match(/\[civilite\](&nbsp;)*.(&nbsp;)*/)
		                if !match.nil? && match.length > 2
		                  i = 0
		                  spaces = ''
		                  while i < (match.length-1) do
		                    spaces = ' '+ spaces
		                    i = i+1
		                  end
		                  membre[:sexe] == 'M'? node.content = "MR"+spaces : node.content = "MME"+spaces
		                else
		                  membre[:sexe] == 'M'? node.content = "MR" : node.content = "MME"
		                end
		              when 'prenom'
		                # match spaces
		                match = node.content.match(/\[prenom\](&nbsp;)*.(&nbsp;)*/)
		                if !match.nil? && match.length > 2
		                  i = 0
		                  spaces = ''
		                  while i < (match.length-1) do
		                    spaces = ' '+ spaces
		                    i = i+1
		                  end
		                  node.content= membre[:prenom]+space
		                else
		                  node.content= membre[:prenom]
		                end
		              when "date"
		                # match spaces
		                match = node.content.match(/\[date\](&nbsp;)*.(&nbsp;)*/)
		                if !match.nil? && match.length > 2 
		                  i = 0
		                  spaces = ''
		                  while i < (match.length-1) do
		                    spaces = ' '+ spaces
		                    i = i+1
		                  end
		                  node.content = DateTime.now +spaces
		                else
		                  node.content = DateTime.now
		                end
		              when "adresse"
		                # match spaces
		                match = node.content.match(/\[adresse\](&nbsp;)*.(&nbsp;)*/)
		                if !match.nil? && match.length > 2
		                  i = 0
		                  spaces = ''
		                  while i < (match.length-1) do
		                    spaces = ' '+ spaces
		                    i = i+1
		                  end
		                  node.content = membre[:adresse]+ spaces
		                else
		                  node.content = membre[:adresse]
		                end
		              when "nom"
		                # match spaces
		                match = node.content.match(/\[nom\](&nbsp;)*.(&nbsp;)*/)
		                if !match.nil? && match.length > 2
		                  i = 0
		                  spaces = ''
		                  while i < (match.length-1) do
		                    spaces = ' '+ spaces
		                    i = i+1
		                  end
		                  node.content = membre[:nom]+spaces
		                else
		                  node.content = membre[:nom]
		                end
		              when "signature"
		                match = node.content.match(/\["#{node_name}"\](&nbsp;)*.(&nbsp;)*/)
		                if !match.nil? && match.length >2
		                  i = 0
		                  spaces = ''
		                  while i < (match.length-1) do
		                    spaces = ' '+ spaces
		                    i = i+1
		                  end
		                  node.content = 'signature' +spaces
		                else
		                  node.content = 'signature'
		                end
		              end
		            end
		          end
		        end #nodes
	        	#puts document.to_html
		        begin
		        	# send test emails
			        Mail.deliver do
					      from    'support@laclasse.com'
					      to      'user@laclasse.com'
					      subject 'publipostage'
					      body   Nokogiri::HTML(document.to_html).text
					    end
			    	rescue
			    	end
	      	end #membre
	    end #destinataire
	  # test .
		puts Mail::TestMailer.deliveries.first
		puts Mail::TestMailer.deliveries.length
	end
end