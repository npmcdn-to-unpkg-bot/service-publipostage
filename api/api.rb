# coding: utf-8
require 'grape'
require 'mail'

class ApplicationAPI < Grape::API
  # response format = pdf 
  content_type :json, 'application/json'
  content_type :pdf, 'application/pdf'
  format :json
  ############################################################################
  desc "Retourner la listes des publipostage"
  params do
      optional :limit, type: Integer, desc: "Nombre maximum de résultat renvoyés"
      optional :page, type: Integer, desc: "Dans le cas d'une requète paginée"
      optional :sort_col, type: String, desc: "Nom de la colonne sur laquelle faire le tri"
      optional :sort_dir, type: String, regexp: /^(asc|desc)$/i, desc: "Direction de tri : ASC ou DESC"
  end
  get "/publipostages" do
    content_type 'application/json'
    dataset = Publipostage.dataset
    dataset.extend(Sequel::DatasetPagination)
      # return all publipostages
      if params[:all] == true
        dataset.select(:id, :code_uai, :nom).naked
      else
        # todo : Limit arbitraire de 500, gérer la limit max en fonction du profil ?
        page_size = params[:limit] ? params[:limit] : 20
        page_no = params[:page] ? params[:page] : 1

        dataset = dataset.paginate(page_no, page_size)
        data = dataset.collect{ |x| {
          :id => x.id,
          :message => x.message,
          :descriptif => x.descriptif,
          :date => x.date,
          :message_type => x.message_type,
          :destinataires => x.destinataires
          }
        }
        {total: dataset.pagination_record_count, page: page_no, data: data}
      end
    #publis = Publipostage.all
    #present publis, with: API::Entities::PublipostageEntity
  end

  ############################################################################
  desc "Retourner un  publipostage par id"
  get '/publipostages/:id' do
    Publipostage[:id => params['id']]
  end

  ############################################################################ 
  desc "creer un nouveau publipostage" 
  post '/publipostages' do
    if params.has_key?('descriptif') and params.has_key?('message') and params.has_key?('destinataires') and params.has_key?('message_type') and params.has_key?('send_type')
      # new Publi
      #puts params['message_type'].inspect
      publi = Publipostage.create(:descriptif => params['descriptif'], :message => params['message'], 
                                  :date => DateTime.now, :message_type => params['message_type'])
      destinations = params['destinataires']
      destinations.each do |dest|
        if dest.respond_to?('classe_id')
          Destinataire.create(:regroupement_id => dest.classe_id, :publipostage_id => publi.id)
        elsif dest.respond_to?('groupe_id')
          Destinataire.create(:regroupement_id => dest.groupe_id, :publipostage_id => publi.id)
        elsif dest.respond_to?('profil_id')
          #puts "case of ecrire personnels"
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
      # send emails
      if publi.difusion_email
        begin
        h = {'ecrire_eleves' => 'eleves', 'ecrire_profs' => 'profs', 'info_famille' => 'parents'}
          if !params['message_type'].nil?
            EmailGenerator.send_emails(publi.message, publi.destinataires, h[params['message_type']])
          end
        rescue
        end
      end
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
    publi = Publipostage[:id => params[:id]]
    destinataires = publi.destinataires 
    if !publi.nil?&&publi[:difusion_pdf]&&!destinataires.empty?
      final_document = ""
      case publi.message_type
      when 'info_famille'
        final_document = PdfGenerator::generate_info_famille_pdf(publi[:message], destinataires)
      when 'ecrire_profs'
        final_document = PdfGenerator::generate_profs_pdf(publi[:message], destinataires)
      when 'ecrire_eleves'
        final_document = PdfGenerator::generate_eleves_pdf(publi[:message], destinataires)
      when 'ecrire_personnels'
        final_document = publi[:message]
      when 'ecrire_tous'
        final_document = publi[:message]    
      end
      # generate pdf
      kit = PDFKit.new(final_document, :page_size => 'Letter')
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

  desc "retourner la liste des personnels dans letablissement"
  get "/etablissements/:uai/personnels" do
    content_type 'application/json'
    Annuaire.get_personnel(params[:uai])
  end
  ############################################################################
  desc "send a notification"
  post "/notification/:uai/:profil/:uid/:type" do
    #puts request.inspect
  end

end