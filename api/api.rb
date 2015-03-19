  # coding: utf-8
require 'grape'
require 'laclasse/cross_app/sender'

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

    def profil_actif_etab_uai
      user =  @current_user[:user_detailed]
      etablissement_code_uai = user['profil_actif']['etablissement_code_uai']
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
    Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_publipostage, nil, {})
  end
  ############################################################################
  desc "Retourner un  publipostage par id"
  get 'publipostages/:id' do
    Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_publipostage, params[:id], {})
  end
  ############################################################################ 
  desc "creer un nouveau publipostage" 
  params do
    requires :descriptif, type: String, desc: "descriptif du publipostage"
    requires :message, type: String, desc: "message du publipostage"
    requires :message_type, type: String, desc: "type de message du publipostage"
    requires :diffusion_type, type: String, desc: "type d'envoi du publipostage"
    requires :destinataires, type: Array, desc: "destinataires du publipostage"
  end
  post '/publipostages' do
    begin
      params[:user_uid] = current_user[:info].uid
      puts params.inspect
      Laclasse::CrossApp::Sender.post_request_signed(:service_annuaire_publipostage,nil,{}, params)
    rescue => e
      puts e.message
      puts e.backtrace[0...10]
      error!(e.message, 400)
    end
  end
  ############################################################################

  desc "duppliquer un publipostage"
  post '/publipostage/:id' do
  end

  ############################################################################
  desc "retourner le fichier pdf d\'un publipostage"
  get '/publipostage/:id/pdf'do
    publipostage = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_publipostage, params[:id], {})
    if publipostage["user_uid"] == current_user[:info]['uid'] || Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user , current_user[:info]['uid'], {})['roles_max_priority_etab_actif'] >= 3
      content_type 'application/pdf'
      signed_url = Laclasse::CrossApp::Sender.sign(:service_annuaire_publipostage, params[:id] + '/pdf', {})
      return RestClient.get signed_url
    end
    error!('Vous n\'êtes pas le créateur de ce publipostage',401)
  end

  ############################################################################
  desc "modifier un publipostage"
  put '/publipostages/:id' do
  end

  ############################################################################
  desc "supprimer un publipostage"
  delete '/publipostages/:id' do
    begin
      Laclasse::CrossApp::Sender.delete_request_signed(:service_annuaire_publipostage, params[:id], {})
    rescue => e
      error!("Requête incorrecte: une erreur s\'est produite: #{e.message}", 400)
    end
  end

  ############################################################################
  desc "retourner la liste des profil"
  get '/profils' do
    content_type 'application/json;charset=UTF-8'
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_profils, nil, {})
    response
  end

  ############################################################################
  desc "retourner les info de l'utilisateur"
  get '/user/:id' do
    content_type 'application/json;charset=UTF-8'
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user, params[:id], {"expand" => "true"})
    response
  end

  ############################################################################
  desc "retourner les regroupements d'un utilisateur"
  get "/regroupements/:id" do
    content_type 'application/json;charset=UTF-8'
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user, params[:id], {"expand" => "true"})
    if !response.nil?
      etablissements = []
      regroupements =[]
      response["etablissements"].each do |etab|
        etablissements.push({:id => etab["id"], :nom => etab["nom"]}) if !etablissements.include?({:id => etab["id"], :nom => etab["nom"]})
      end
      response["classes"].each do |classe|
        classe["id"]= classe["classe_id"]
        classe["libelle"]= classe["classe_libelle"]
        classe["type"] = "classe"
        classe["destinataire_libelle"] = classe["classe_libelle"]
        #uniquement les regroupements du profil actif
        regroupements.push(classe) if response["profil_actif"]["etablissement_id"] == classe["etablissement_id"]
      end
      response["groupes_eleves"].each do |groupe|
        groupe["id"]= groupe["groupe_id"]
        groupe["libelle"]= groupe["groupe_libelle"]
        groupe["type"] = "groupe"
        groupe["destinataire_libelle"] = groupe["groupe_libelle"]
        #uniquement les regroupements du profil actif
        regroupements.push(groupe) if response["profil_actif"]["etablissement_id"] == groupe["etablissement_id"]
      end
      { :etablissements => etablissements, :regroupements => regroupements}
    else
      return []
    end
  end
  #############################################################################
  desc "retourner la liste des personnels dans letablissement"
  get "/etablissements/personnels" do
    personnels = []
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_personnel, profil_actif_etab_uai + '/personnel',{})
    response.each do |personnel|
      personnel["destinataire_libelle"] = personnel["nom"] + " " + personnel["prenom"]
      personnels << personnel
    end
    content_type 'application/json;charset=UTF-8'
    return personnels
  end
  #############################################################################
  desc "retourner la liste des matieres dans letablissement"
  get "/etablissements/matieres" do
    personnels = []
    Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_personnel, profil_actif_etab_uai + '/matieres',{})
  end
  ############################################################################
  desc "send a notification"
  post "/notification/:uai/:profil/:uid/:type" do
    #puts request.inspect
  end
  
  ############################################################################
  desc "retourner les informations de diffusion pour la pupulation et les regroupements passés en paramètre" 
  get "/diffusion_info/:population/:regroupements" do
    mat_string = ("professors" == params[:population] && !params[:matiere].nil? && params[:matiere] != "-1" )  ? '/' + params[:matiere] : '' 
    Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_diffusion_info, params[:population] + '/' + params[:regroupements] + mat_string,{})
  end
end