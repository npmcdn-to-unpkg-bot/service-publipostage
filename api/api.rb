  # coding: utf-8
require 'grape'
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
    Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_publipostage],{})
  end
  ############################################################################
  desc "Retourner un  publipostage par id"
  get 'publipostages/:id' do
    Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_publipostage] + params[:id], {})
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
      Annuaire.post_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_publipostage],{}, params)
    rescue => e
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
    content_type 'application/pdf'
    signed_url = Annuaire.sign(ANNUAIRE[:url], ANNUAIRE[:service_publipostage] + params[:id] + '/pdf', {})
    RestClient.get signed_url
  end

  ############################################################################
  desc "modifier un publipostage"
  put '/publipostages/:id' do
  end

  ############################################################################
  desc "supprimer un publipostage"
  delete '/publipostages/:id' do
    puts "????"
    begin
      Annuaire.delete_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_publipostage] + params[:id], {})
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
      regroupements =[]
      response["etablissements"].each do |etab|
        etablissements.push({:id => etab["id"], :nom => etab["nom"]}) if !etablissements.include?({:id => etab["id"], :nom => etab["nom"]})
      end
      response["classes"].each do |classe|
        classe["id"]= classe["classe_id"]
        classe["libelle"]= classe["classe_libelle"]
        classe["type"] = "classe"
        classe["destinataire_libelle"] = classe["classe_libelle"]
        regroupements.push(classe)
      end
      response["groupes_eleves"].each do |groupe|
        groupe["id"]= groupe["groupe_id"]
        groupe["libelle"]= groupe["groupe_libelle"]
        groupe["type"] = "groupe"
        groupe["destinataire_libelle"] = groupe["groupe_libelle"]
        regroupements.push(groupe)
      end
      { :etablissements => etablissements, :regroupements => regroupements}
    else
      return []
    end
  end
  #############################################################################
  desc "retourner la liste des personnels dans letablissement"
  get "/etablissements/:uai/personnels" do
    personnels = []
    response = Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_personnel]+ params[:uai] +'/personnel',{})
    response.each do |personnel|
      personnel["destinataire_libelle"] = personnel["nom"] + " " + personnel["prenom"]
      personnels << personnel
    end
    content_type 'application/json;charset=UTF-8'
    return personnels
  end
  #############################################################################
  desc "retourner la liste des matieres dans letablissement"
  get "/etablissements/:uai/matieres" do
    personnels = []
    Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_personnel]+ params[:uai] +'/matieres',{})
  end
  ############################################################################
  desc "send a notification"
  post "/notification/:uai/:profil/:uid/:type" do
    #puts request.inspect
  end
  
  ############################################################################
  desc "retourner les informations de diffusion pour la pupulation et les regroupements passés en paramètre" 
  get "/diffusionInfo/:population/:regroupements" do
    Annuaire.send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_diffusionInfo] + params[:population] + '/' + params[:regroupements],{})
  end
end