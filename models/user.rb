class User < Sequel::Model(:user)
	plugin :validation_helpers
  	plugin :json_serializer
  	one_to_many :email

  def email_principal
    email = DB[:email].filter(:user_id => self.id, :principal => true).first
    return email.nil? ? nil : email[:adresse]
  end

  def email_academique
    email = DB[:email].filter(:user_id => self.id, :academique => true).first
    return email.nil? ? nil : email[:adresse]
  end

  def has_email?
    DB[:email].filter(:user_id => self.id).count > 0
  end

  def emails
  	DB[:email].filter(:user_id => self.id).all
  end
end