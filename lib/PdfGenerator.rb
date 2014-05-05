# encoding: utf-8
# -*- coding: utf-8 -*-

# ensemble de services pour communiquer avec l'annuaire
module PdfGenerator
	Nodes = ['.civilite', '.date', '.nom', '.prenom', '.nom_eleve', '.prenom_eleve', '.adresse', '.signature']
	
	def PdfGenerator.generate_info_famille_pdf(message, destinataires)
		final_document = ""
		destinataires.each do |dest|
      regroupement = dest.regroupement_dataset.first
      regroupement.parents.each do |parent|
        html = HTMLEntities.new.decode message
        document = Nokogiri::HTML(html)
        #loop over nodes 
        Nodes.each do |node_name|
          node = document.at_css(node_name)
          # mockup data
          if !node.nil?
            case node_name
            when '.civilite'
              parent[:sexe] == 'M'? node.content = "MR" : node.content = "MME"
            when '.prenom'
              node.content= parent[:prenom]
            when ".date"
              node.content = DateTime.now
            when ".nom"
              node.content = parent[:nom]
            when ".adresse"
              node.content = parent[:adresse]
            end
          end
        end #nodes
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
          node = document.at_css(node_name)
          # mockup data
          if !node.nil?
            case node_name
            when '.civilite'
              prof[:sexe] == 'M'? node.content = "MR" : node.content = "MME"
            when '.prenom'
              node.content= prof[:prenom]
            when ".date"
              node.content = DateTime.now
            when ".nom"
              node.content = prof[:nom]
            when ".adresse"
              node.content = prof[:adresse]
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
          node = document.at_css(node_name)
          # mockup data
          if !node.nil?
            case node_name
            when '.civilite'
              eleve[:sexe] == 'M'? node.content = "MR" : node.content = "MME"
            when '.prenom'
              node.content= eleve[:prenom]
            when ".date"
              node.content = DateTime.now
            when ".nom"
              node.content = eleve[:nom]
            when ".adresse"
              node.content = eleve[:adresse]
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