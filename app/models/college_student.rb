class CollegeStudent < ActiveRecord::Base
  belongs_to :college
  belongs_to :high_school
  has_many :conversations
  validates :fb_user_id, uniqueness: true

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
        break token unless (HighSchooler.where(auth_token: token).first || CollegeStudent.where(auth_token: token).first)
      end
    end	
  
end
