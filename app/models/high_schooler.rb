class HighSchooler < ActiveRecord::Base
  has_many :colleges, through: :target_colleges
  has_many :target_colleges, dependent: :destroy
  has_many :conversations, dependent: :destroy
  validates :fb_user_id, uniqueness: :true
  validate :unique_fb_id, on: :create
  belongs_to :high_school

before_save :ensure_auth_token

  def unique_fb_id
    invalid = HighSchooler.where(fb_user_id: self.fb_user_id).exists? || CollegeStudent.where(fb_user_id: self.fb_user_id).exists?
    self.errors.add(:fb_user_id, 'is already taken') if invalid
  end

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
