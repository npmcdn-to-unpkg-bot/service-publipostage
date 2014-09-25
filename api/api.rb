  # coding: utf-8
require 'grape'
require 'mail'
require 'annuaire'

class ApplicationAPI < Grape::API
  # response format = pdf 
  content_type :json, 'application/json'
  content_type :pdf, 'application/pdf'
  format :json
  helpers do
    def current_user
      @current_user ||= env['rack.session'][:current_user]
    end

    def authenticate!
      error!('401 non authentifié', 401) unless current_user
    end
  end

  #
  before do
    authenticate!
  end
  ############################################################################
  desc "Retourner la listes des publipostage"
  params do
      optional :limit, type: Integer, desc: "Nombre maximum de résultat renvoyés"
      optional :page, type: Integer, desc: "Dans le cas d'une requète paginée"
      optional :sort_col, type: String, desc: "Nom de la colonne sur laquelle faire le tri"
      optional :sort_dir, type: String, regexp: /^(asc|desc)$/i, desc: "Direction de tri : ASC ou DESC"
  end
  get "/publipostages" do
    content_type 'application/json;charset=UTF-8'
    dataset = Publipostage.dataset
    dataset.extend(Sequel::DatasetPagination)
    # return all publipostages
    if params[:all] == true
      dataset.select(:id, :code_uai, :nom).naked
    else
      # todo  trier la base
      page_size = params[:limit] ? params[:limit] : 20
      page_no = params[:page] ? params[:page] : 1

      dataset = dataset.paginate(page_no, page_size)
      data = dataset.collect{ |x| {
        :id => x.id,
        :message => x.message,
        :descriptif => x.descriptif,
        :date => x.date,
        :message_type => x.message_type,
        :destinataires => x.destinataires,
        :personnels => x.personnels
        }
      }
      {total: dataset.pagination_record_count, page: page_no, data: data}
    end
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
      begin
        # create a new Publipostage
        DB.transaction do
          publi = Publipostage.create(:descriptif => params['descriptif'], :message => params['message'], 
                                      :date => DateTime.now, :message_type => params['message_type'])
          #ajouter les destinataires
          if params['message_type']=="ecrire_personnels"
            if params['destinataires'].kind_of?(Array)
              publi.personnels = params['destinataires']
            else
              raise 'pas de destinataires'
            end
          else
            destinations = params['destinataires']
            destinations.each do |dest|
              if dest.respond_to?('classe_id')
                Destinataire.create(:regroupement_id => dest.classe_id, :publipostage_id => publi.id)
              elsif dest.respond_to?('groupe_id')
                Destinataire.create(:regroupement_id => dest.groupe_id, :publipostage_id => publi.id)
              else
                raise 'pas de destinataires'
              end
            end
          end

          # add profils in case of ecrire à tous
          if params['message_type']=="ecrire_tous"
            if  !params['profils'].empty?
              publi.profils =  params['profils']
            else
              raise 'pas de profils'
            end
          end

          # add les type de diffusion
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
              h = {'ecrire_eleves' => 'eleves', 'ecrire_profs' => 'profs', 'info_famille' => 'parents', 'ecrire_personnels' => 'personnels'}
              if !params['message_type'].nil?
                if params['message_type'] == "ecrire_personnels"
                  # email personnels
                  EmailGenerator.send_emails_personnels(publi.message, publi.personnels)
                elsif params['message_type'] == "ecrire_tous"
                  # email to profils
                  publi.profils.each do |profil|
                    EmailGenerator.send_emails(publi.message, publi.destinataires, profil)
                  end
                else 
                  EmailGenerator.send_emails(publi.message, publi.destinataires, h[params['message_type']])
                end
              end
            rescue
              raise 'une erreur s\'est produite'
            end
          end
          # retourn le publipostage crée
          publi
        end # end transaction
      rescue => e
        error!(e.message, 400)
      end
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
    if publi.message_type =="ecrire_personnels"
      destinataires = publi.personnels 
    else
      destinataires = publi.destinataires
    end
    if !publi.nil?&&publi[:difusion_pdf]&&!destinataires.empty?
      final_document = ""
      case publi.message_type
      when 'info_famille'
        final_document = PdfGenerator::generate_pdf(publi[:message], destinataires, 'parents')
      when 'ecrire_profs'
        final_document = PdfGenerator::generate_pdf(publi[:message], destinataires, 'profs')
      when 'ecrire_eleves'
        final_document = PdfGenerator::generate_pdf(publi[:message], destinataires, 'eleves')
      when 'ecrire_personnels'
        final_document = PdfGenerator::generate_personnels_pdf(publi[:message], publi.personnels)
      when 'ecrire_tous'
        publi.profils.each do |profil|
          final_document  += "<hr></hr><p color='red'><h2>#{profil}</h2></p><hr></hr>" + PdfGenerator::generate_pdf(publi[:message], destinataires, profil)
        end
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
    query = params[:id]
    begin
      if query.class == String && query.size==1
        puts Publipostage.where(:id => params['id']);
        Publipostage.where(:id => params['id']).destroy
      elsif (query = JSON.parse(params[:id])).class == Hash
        query.each do |key, value|
          if value
            Publipostage.where(:id => key).destroy
          end
        end
      else
       error!('Requête incorrecte: les parametres ne sont pas valides', 400)
      end
    rescue => e
      error!("Requête incorrecte: une erreur s\'est produite: #{e.message}", 400)
    end
  end

  ############################################################################
  desc "retourner la liste des profil"
  get '/profils' do
    content_type 'application/json;charset=UTF-8'
    response = Annuaire.send_request_signed(ANNUAIRE[:url],ANNUAIRE[:service_profils], {})
    response
  end

  ############################################################################
  desc "retourner les info de l'utilisateur"
  get '/user/:id' do
    content_type 'application/json;charset=UTF-8'
    response = Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_user] + params[:id], {"expand" => "true"})
    response
  end

  ############################################################################
  desc "retourner les regroupements d'un utilisateur"
  get "/regroupements/:id" do
    content_type 'application/json;charset=UTF-8'
    response = Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_user] + params[:id], {"expand" => "true"})
    if !response.nil?
      etablissements = []
      classes =[]
      groupes = []
      response["etablissements"].each do |etab|
      etablissements.push({:id => etab["id"], :nom => etab["nom"]}) if !etablissements.include?({:id => etab["id"], :nom => etab["nom"]})
      end
      { :etablissements => etablissements, :classes => response["classes"], :groupes_eleves => response["groupes_eleves"]}
    else
      return []
    end
  end
  #############################################################################
  desc "retourner la liste des personnels dans letablissement"
  get "/etablissements/:uai/personnels" do
    content_type 'application/json;charset=UTF-8'
    response = Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_personnel]+ params[:uai] +'/personnel',{})
  end
  ############################################################################
  desc "send a notification"
  post "/notification/:uai/:profil/:uid/:type" do
    #puts request.inspect
  end
  
  ############################################################################
  desc "retourner les emails des élèves d'un envoi"
  get "/email/listStudents/:regroupements" do
    Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_email_listStudents]+ params[:regroupements],{})
  end
  ############################################################################
  desc "retourner les emails des professeur d'un envoi"
  get "/email/listProfessors/:regroupements" do
    Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_email_listProfessors]+ params[:regroupements],{})
  end
  ############################################################################
  desc "retourner les emails des membre de la famille d'un envoi"
  get "/email/listFamilly/:regroupements" do
    Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_email_listFamilly]+ params[:regroupements],{})
  end
  ############################################################################
end