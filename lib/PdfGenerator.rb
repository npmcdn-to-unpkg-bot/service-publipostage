# encoding: utf-8
# -*- coding: utf-8 -*-

# ensemble de services pour communiquer avec l'annuaire
module PdfGenerator
	Nodes = ['civilite', 'date', 'nom', 'prenom', 'nomEleve', 'prenomEleve', 'adresse', 'signature']
	
	def PdfGenerator.generate_info_famille_pdf(message, destinataires)
		final_document = ""
		destinataires.each do |dest|
      regroupement = dest.regroupement_dataset.first
      regroupement.parents.each do |parent|
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
                  parent[:sexe] == 'M'? node.content = "MR"+spaces : node.content = "MME"+spaces
                else
                  parent[:sexe] == 'M'? node.content = "MR" : node.content = "MME"
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
                  node.content= parent[:prenom]+space
                else
                  node.content= parent[:prenom]
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
                  node.content = parent[:adresse]+ spaces
                else
                  node.content = parent[:adresse]
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
                  node.content = parent[:nom]+spaces
                else
                  node.content = parent[:nom]
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
        #puts document.css('nom')
        # fill final document
        final_document = final_document+ document.to_html+'<hr></hr>'
      end #regroupement
    end #destinataire
    return final_document
	end

	def PdfGenerator.generate_profs_pdf(message, destinataires)
		final_document = ""
		destinataires.each do |dest|
      regroupement = dest.regroupement_dataset.first
      regroupement.profs.each do |prof|
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
                  prof[:sexe] == 'M'? node.content = "MR"+spaces : node.content = "MME"+spaces
                else
                  prof[:sexe] == 'M'? node.content = "MR" : node.content = "MME"
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
                  node.content= prof[:prenom]+spaces
                else
                  node.content= prof[:prenom]
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
                  node.content = prof[:adresse]+ spaces
                else
                  node.content = prof[:adresse]
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
                  node.content = prof[:nom]+spaces
                else
                  node.content = prof[:nom]
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
        # fill final document
        final_document = final_document+ document.to_html+'<hr></hr>' 
      end #regroupement
    end #destinataire
    return final_document
	end

	def PdfGenerator.generate_eleves_pdf(message, destinataires)
		final_document = ""
		destinataires.each do |dest|
      regroupement = dest.regroupement_dataset.first
      regroupement.eleves.each do |eleve|
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
                  eleve[:sexe] == 'M'? node.content = "MR"+spaces : node.content = "MME"+spaces
                else
                  eleve[:sexe] == 'M'? node.content = "MR" : node.content = "MME"
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
                  node.content= eleve[:prenom]+spaces
                else
                  node.content= eleve[:prenom]
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
                  node.content = eleve[:adresse]+ spaces
                else
                  node.content = eleve[:adresse]
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
                  node.content = eleve[:nom]+spaces
                else
                  node.content = eleve[:nom]
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
        # fill final document
        final_document = final_document+ document.to_html+'<hr></hr>'
      end #regroupement
    end #destinataire
    return final_document
	end

  def PdfGenerator.generate_personnels_pdf(message, destinataires)
    puts destinataires
    final_document = ""
    destinataires.each do |dest|
      html = HTMLEntities.new.decode message
      document = Nokogiri::HTML(html)
      person = User[:id_ent => dest["id_ent"]]
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
                person[:sexe] == 'M'? node.content = "MR"+spaces : node.content = "MME"+spaces
              else
                person[:sexe] == 'M'? node.content = "MR" : node.content = "MME"
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
                node.content= person[:prenom]+spaces
              else
                node.content= person[:prenom]
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
                node.content = person[:adresse]+ spaces
              else
                node.content = person[:adresse]
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
                node.content = person[:nom]+spaces
              else
                node.content = person[:nom]
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
      # fill final document
      final_document = final_document+ document.to_html+'<hr></hr>'
    end #destinataire
  return final_document
  end

end