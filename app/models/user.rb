class User < ActiveRecord::Base
before_save :ensure_auth_token

  def ensure_auth_token
    if auth_token.blank?
      self.auth_token = generate_auth_token
    end
  end

  private

    def generate_auth_token
      loop do
        token = Devise.friendly_token
        break token unless User.where(auth_token: token).first
      end
    end	
end
