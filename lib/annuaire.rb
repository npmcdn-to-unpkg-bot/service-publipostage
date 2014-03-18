# encoding: utf-8
# -*- coding: utf-8 -*-

require 'base64'
require 'cgi'
require 'openssl'
require 'rest-client'

require_relative '../config/annuaire.rb'

# ensemble de services pour communiquer avec l'annuaire
module Annuaire
  module_function

  #signe une requête 
  def sign( uri, service, args, secret_key, app_id )
    timestamp = Time.now.getutc.strftime('%FT%T')
    canonical_string = "#{uri}/#{service}?"

    canonical_string += Hash[ args.sort ].map { |key, value| "#{key}=#{CGI.escape(value)}" }.join( '&' )
    canonical_string += ";#{timestamp};#{app_id}"

    digest = OpenSSL::Digest::Digest.new( 'sha1' )
    digested_message = Base64.encode64( OpenSSL::HMAC.digest( digest, secret_key, canonical_string ) )

    query = args.map { |key, value| "#{key}=#{CGI.escape(value)}" }.join( '&' )

    signature = { app_id: app_id,
                  timestamp: timestamp,
                  signature: digested_message }.map { |key, value| "#{key}=#{CGI.escape(value)}" }.join( ';' ).chomp

    "#{uri}/#{service}?#{query};#{signature}"
  end

  #envoie une requête 
  def send_request_signed(url, service, args)
    RestClient.get( sign(url, service, args, ANNUAIRE[:secret], ANNUAIRE[:app_id] ),  ) do
      |response, request, result|
      if response.code == 200
        return JSON.parse( response )
      else
        STDERR.puts 'URL fautive: ' + sign(url, service, args, ANNUAIRE[:secret], ANNUAIRE[:app_id] ) + '  Code : ' + response.code.to_s
        return nil
      end
    end
  end

  #retourne les informations de l'annuaire pour un utilisateur
  def get_user(uid)
    response = send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_user] + uid.to_s, {"expand" => "true"})
    response
  end
  
  def get_profils
    response = send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_profils],{})
    response 
  end

  #retourne les infos sur plusieurs utilisateurs.
  def get_users(uids)
    #on transforme la liste d'UIDS en chaines de caractères pour effectuer la requête
    list_uid = ""
    uids.each do |uid|
      if list_uid.empty?
        list_uid += uid.to_s
      else
        list_uid += ";"+uid.to_s
      end
    end
    return send_request_signed(ANNUAIRE[:url], ANNUAIRE[:service_users] + list_uid, {})
  end

  #récupère tous les regroupements pour un utilisateurs
  def get_regroupements(uid)
    response = get_user uid
    etablissements = []
    classes =[]
    groupes = []
    if (!response.nil?)
      #code
      response["etablissements"].each do |etab|
      etablissements.push(hash_regroupement(etab["id"],etab["nom"], nil, nil)) if !etablissements.include?(hash_regroupement(etab["id"],etab["nom"], nil, nil))
      end
      { :etablissements => etablissements, :classes => response["classes"], :groupes_eleves => response["groupes_eleves"]}
    else
      return []
    end
  end

  #retourne un hash d'un regroupements avec son id et son nom
  def hash_regroupement(id, nom, etab_id, etab_nom)
    {
      :id => id,
      :nom => nom,
      :etab_id => etab_id,
      :etab_nom => etab_nom
    }
  end

  #retourne un etablissement avec ses classes et ses groupes
  def regroupements_with_etabName(etab, rgrpnt)
    regroupement = {}
    regroupement[:id] = rgrpnt[:id]
    regroupement[:nom] = rgrpnt[:nom]
    regroupement[:etab_nom] = etab[:nom]
    regroupement[:etab_id] = etab[:id]
    regroupement[:color] =''
    regroupement
  end

  #retourne une liste d'établissement avec ses classe et ses groupes
  def liste_regroupements(etabs, classes, groupes)
    regroupements = []
    etabs.each do |etab|
      classes.each do |classe|
        regroupements.push regroupements_with_etabName(etab, classe) if classe[:etab_id] == etab[:id]
      end
      groupes.each do |groupe|
        regroupements.push regroupements_with_etabName(etab, groupe) if groupe[:etab_id] == etab[:id]
      end
    end
    regroupements
  end
end