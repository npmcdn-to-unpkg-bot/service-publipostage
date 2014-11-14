# -*- encoding: utf-8 -*-

module AuthenticationHelpers
  
  def is_logged?
    env['rack.session'][:authenticated]
  end

  #
  # Log l'utilisateur puis redirige vers 'auth/:provider/callback' qui se charge
  #   d'initialiser la session et de rediriger vers l'url passée en paramètre
  #
  def login!( route )
    if !route.empty?
      route += "?" + env['QUERY_STRING'] if !env['QUERY_STRING'].empty?
      route = URI.escape(env['rack.url_scheme'] + "://" + env['HTTP_HOST'] + route)
      redirect  APP_PATH + "/auth/cas?url=#{URI.encode( route )}"
    end
    redirect APP_PATH + "/auth/cas"
  end

  #
  # Délogue l'utilisateur du serveur CAS et de l'application
  #
  def logout!( url )
    url += "?" + env['QUERY_STRING'] if !env['QUERY_STRING'].empty?
    env['rack.session'][:authenticated] = false
    env['rack.session'][:current_user] = nil
    CASAUTH::CONFIG[:ssl] ? protocol = 'https://' : protocol = 'http://'
    redirect protocol + CASAUTH::CONFIG[:host] + CASAUTH::CONFIG[:logout_url] +'?destination='+URI.encode(url)
  end

  #
  # récupération des données envoyée par CAS
  #
  def set_current_user( env )
    env['rack.session'][:current_user] = { user: nil, info: nil }
    if env['rack.session'][:user]
      env['rack.session'][:current_user][:user] ||= env['rack.session'][:user]
      env['rack.session'][:current_user][:info] ||= env['rack.session'][:extra]
      #env['rack.session'][:current_user][:info][:ENTStructureNomCourant] ||= env['rack.session'][:current_user][:extra][:ENTPersonStructRattachRNE]
    end
    env['rack.session'][:current_user]
  end

  #
  # Initialisation de la session après l'authentification
  #
  def init_session( env )
    if env['rack.session']
      env['rack.session'][:user] = env['omniauth.auth'].extra.user
      env['rack.session'][:extra] = env['omniauth.auth'].extra
      env['rack.session'][:authenticated] = true
    end
    set_current_user env
  end

end
