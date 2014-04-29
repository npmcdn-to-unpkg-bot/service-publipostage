# coding: utf-8
require 'grape'

class ApplicationAPI < Grape::API
  # response format = pdf 
  content_type :json, 'application/json'
  content_type :pdf, 'application/pdf'
  format :json
  ############################################################################
  desc "Retourner la listes des publipostage"
  get "/publipostages" do
    content_type 'application/json'
    publis = Publipostage.all
    #present publis, with: API::Entities::PublipostageEntity
    publis
  end

  ############################################################################
  desc "Retourner un  publipostage par id"
  get '/publipostages/:id' do
    Publipostage[:id => params['id']]
  end

  ############################################################################ 
  desc "creer un nouveau publipostage" 
  post '/publipostages' do
    puts params.inspect
    if params.has_key?('descriptif') and params.has_key?('message') and params.has_key?('destinataires') and params.has_key?('message_type') and params.has_key?('send_type')
      # new Publi
      puts params['send_type'].inspect
      publi = Publipostage.create(:descriptif => params['descriptif'], :message => params['message'], 
                                  :date => DateTime.now, :message_type => params['message_type'])
      destinations = params['destinataires']
      destinations.each do |dest|
        if dest.respond_to?('classe_id')
          Destinataire.create(:etablissement_code_uai => dest.etablissement_code , :regroupement_id => dest.classe_id, :publipostage_id => publi.id, :libelle => dest.classe_libelle)
        elsif dest.respond_to?('groupe_id')
          Destinataire.create(:etablissement_code_uai => dest.etablissement_code , :regroupement_id => dest.groupe_id, :publipostage_id => publi.id, :libelle => dest.groupe_libelle)
        else
          "error"
        end
      end
      diffusion_types = params['send_type']
      diffusion_types.each do |type|
        case type
        when "byMail"
          publi.difusion_email = true
        when "byPdf"
          publi.difusion_pdf = true
        when "byNotif"
          publi.difusion_notif = true
        else
        end
      end  
      publi.save
      publi
    else
      error!('Mauvaise requête', 400)
    end
  end
  ############################################################################

  desc "duppliquer un publipostage"
  post '/publipostage/:id' do
  end

  ############################################################################
  desc "retourner le fichier pdf d\'un publipostage"
  get '/publipostage/:id/pdf'do
    nodes = ['.civilite', '.date', '.nom', '.prenom', '.nom_eleve', '.prenom_eleve', '.adresse', '.signature']
    publi = Publipostage[:id => params[:id]]
    if !publi.nil?&&publi[:difusion_pdf]
    html = HTMLEntities.new.decode publi[:message]
      document = Nokogiri::HTML(html)
      #loop over nodes 
      nodes.each do |node_name|
        node = document.at_css(node_name)
        if !node.nil?
          case node_name
          when '.civilite'
            node.content = "MR"
          when '.prenom'
            node.content="Jaun"
          when ".date"
            node.content = DateTime.now
          when ".nom"
            node.content = "nom"
          when ".adresse"
            node.content = "adresse"
          end
        end
      end
      #
      html = document.to_html
      (1..5).each  do |i|
        html = html + html
      end
      kit = PDFKit.new(html, :page_size => 'Letter')
      #filename = "public/pdfs/file_#{publi.id}.pdf"
      #puts filename
      #file = kit.to_file(filename)
      #kit = PDFKit.new('<html><head><meta name="pdfkit-page_size" content="Letter"')
      #file = kit.to_file(filename)
      #{
        #pdf: file
      #}
      content_type 'application/pdf'
      pdf = kit.to_pdf
    else
      error!('Ressource non trouvee', 404)
    end
  end
  ############################################################################

  desc "modifier un publipostage"
  put '/publipostages/:id' do
  end

  ############################################################################
  desc "supprimer un publipostage"
  delete '/publipostages/:id' do
    Publipostage.where(:id => params['id']).destroy
  end

  ############################################################################
  desc "retourner la liste des profil"
  get '/profils' do
    content_type 'application/json'
    Annuaire.get_profils()
  end

  ############################################################################
  desc "retourner les info de l'utilisateur"
  get '/user/:id' do
    content_type 'application/json'
    Annuaire.get_user(params[:id])
  end

  ############################################################################
  desc "retourner les regroupements d'un utilisateur"
  get "/regroupements/:id" do
    content_type 'application/json'
    Annuaire.get_regroupements(params[:id])
  end

end