class CollegeStudent < ActiveRecord::Base
  belongs_to :college
  belongs_to :high_school
  has_many :conversations, dependent: :destroy
  validates :fb_user_id, uniqueness: true

before_save :ensure_auth_token, :ensure_confirmation_code

  def ensure_auth_token
    if auth_token.blank?
      self.auth_token = generate_auth_token
    end
  end

  def ensure_confirmation_code
    if confirmation_code.blank?
      self.confirmation_code = generate_confirmation_code
    end
  end    

  private

    def generate_auth_token
      loop do
        token = Devise.friendly_token
        break token unless (HighSchooler.where(auth_token: token).first || CollegeStudent.where(auth_token: token).first)
      end
    end	

    def generate_confirmation_code
      loop do
        token = Devise.friendly_token
        break token unless CollegeStudent.where(confirmation_code: token).first
      end
    end     
  
end
