# coding: utf-8
require 'grape'
require 'laclasse/cross_app/sender'

#
# FIXME: API for Publipostage
#
class ApplicationAPI < Grape::API
  # response format = pdf
  content_type :json, 'application/json'
  content_type :pdf, 'application/pdf'
  format :json

  include Lib::Publipostage

  helpers do
    def current_user
      @current_user ||= env['rack.session'][:current_user]
    end

    def authenticate!
      error!('401 non authentifié', 401) unless current_user
    end

    def profil_actif_etab_uai
      user = @current_user[:user_detailed]

      user['profil_actif']['etablissement_code_uai']
    end
  end

  #
  before do
    authenticate!
  end

  ############################################################################
  desc 'Retourner la listes des publipostage'
  params do
    optional :limit, type: Integer, desc: 'Nombre maximum de résultat renvoyés'
    optional :page, type: Integer, desc: "Dans le cas d'une requête paginée"
    optional :sort_col, type: String, desc: 'Nom de la colonne sur laquelle faire le tri'
    optional :sort_dir, type: String, regexp: /^(asc|desc)$/i, desc: 'Direction de tri : ASC ou DESC'
  end
  get '/publipostages' do
    r = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_publipostage, '', {})
    r['data'].select { |e| e['user_uid'] == @current_user[:info][:uid] }
    r['total'] = r['data'].size
    r
  end

  ############################################################################
  desc 'Retourner un  publipostage par id'
  get 'publipostages/:id' do
    Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_publipostage, params[:id], {})
  end

  ############################################################################
  desc 'creer un nouveau publipostage'
  params do
    requires :descriptif, type: String, desc: 'descriptif du publipostage'
    requires :message, type: String, desc: 'message du publipostage'
    requires :message_type, type: String, desc: 'type de message du publipostage'
    requires :diffusion_type, type: String, desc: "type d'envoi du publipostage"
    requires :destinataires, type: Array, desc: 'destinataires du publipostage'
    requires :destinataires_libelle, type: String, desc: 'Phrase décrivant les destinataires du publipostage'
  end
  post '/publipostages' do
    begin
      params[:user_uid] = current_user[:info].uid
      Laclasse::CrossApp::Sender.post_request_signed(:service_annuaire_publipostage, nil, {}, params)
    rescue => e
      puts e.message
      puts e.backtrace[0...10]
      error!(e.message, 400)
    end
  end

  ############################################################################
  desc 'mettre à jour un publipostage'
  params do
    requires :id
    requires :descriptif, type: String, desc: 'descriptif du publipostage'
    requires :message, type: String, desc: 'message du publipostage'
    requires :message_type, type: String, desc: 'type de message du publipostage'
    requires :diffusion_type, type: String, desc: "type d'envoi du publipostage"
    requires :destinataires, type: Array, desc: 'destinataires du publipostage'
    requires :destinataires_libelle, type: String, desc: 'Phrase décrivant les destinataires du publipostage'
  end
  put '/publipostages/:id' do
    begin
      params[:user_uid] = current_user[:info].uid
      Laclasse::CrossApp::Sender.put_request_signed( :service_annuaire_publipostage, "#{params[:id]}", {}, params )
    rescue => e
      puts e.message
      puts e.backtrace[0...10]
      error!(e.message, 400)
    end
  end

  ############################################################################
  desc "retourner le fichier pdf d\'un publipostage"
  get '/publipostage/:id/pdf' do
    publipostage = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_publipostage, params[:id], {})
    if publipostage['user_uid'] == current_user[:info]['uid'] ||
       Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user,
                                                      current_user[:info]['uid'], {})['roles_max_priority_etab_actif'] >= 3
      content_type 'application/pdf'
      env['api.format'] = :binary
      header 'Content-Disposition', "inline; filename*=UTF-8''publipostage_#{URI.escape(params[:id])}.pdf"

      signed_url = Laclasse::CrossApp::Sender.sign(:service_annuaire_publipostage, params[:id] + '/pdf', {})
      return RestClient.get signed_url
    end
    error!('Vous n\'êtes pas le créateur de ce publipostage', 401)
  end

  ############################################################################
  desc 'supprimer un publipostage'
  delete '/publipostages/:id' do
    begin
      Laclasse::CrossApp::Sender.delete_request_signed(:service_annuaire_publipostage, params[:id], {})
    rescue => e
      error!("Requête incorrecte: une erreur s\'est produite: #{e.message}", 400)
    end
  end

  ############################################################################
  desc 'retourner la liste des profil'
  get '/profils' do
    content_type 'application/json;charset=UTF-8'
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_profils, nil, {})
    response
  end

  ############################################################################
  desc "retourner les info de l'utilisateur"
  get '/user/:id' do
    content_type 'application/json;charset=UTF-8'
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user, params[:id], 'expand' => 'true')
    response
  end

  ############################################################################
  desc "retourner les regroupements d'un utilisateur"
  get '/regroupements/:id' do
    content_type 'application/json;charset=UTF-8'
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_user, params[:id], 'expand' => 'true')
    Lib::Publipostage.get_regroupements response
  end

  #############################################################################
  desc 'retourner la liste des personnels dans letablissement'
  get '/etablissements/personnels' do
    response = Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_personnel, profil_actif_etab_uai + '/personnel', {})
    content_type 'application/json;charset=UTF-8'
    return Lib::Publipostage.get_personnels response
  end

  #############################################################################
  desc 'retourner la liste des matieres dans letablissement'
  get '/etablissements/matieres' do
    Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_personnel, profil_actif_etab_uai + '/matieres', {})
  end

  ############################################################################
  desc 'retourner les informations de diffusion pour la pupulation et les regroupements passés en paramètre'
  get '/diffusion_info/:population/:regroupements' do
    matiere = Lib::Publipostage.get_matiere_string(params)
    Laclasse::CrossApp::Sender.send_request_signed(:service_annuaire_diffusion_info,
                                                   params[:population] + '/' + params[:regroupements] + matiere,
                                                   {})
  end
end
