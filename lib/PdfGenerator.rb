# encoding: utf-8
# -*- coding: utf-8 -*-

# ensemble de services pour communiquer avec l'annuaire
module PdfGenerator
	Nodes = ['civilite', 'date', 'nom', 'prenom', 'nomEleve', 'prenomEleve', 'adresse', 'signature']

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

  def PdfGenerator.generate_pdf(message, destinataires, type)
    final_document = ""
    destinataires.each do |dest|
      regroupement = dest.regroupement_dataset.first
      case type
      when 'profs'
        membres = regroupement.profs
      when 'parents'
        membres = regroupement.parents
      when 'eleves'
        membres = regroupement.eleves
      end
      membres.each do |membre|
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
                  node.content= membre[:prenom]+spaces
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
        # fill final document
        final_document = final_document+ document.to_html+'<hr></hr>' 
      end #regroupement
    end #destinataire
    return final_document
  end

end