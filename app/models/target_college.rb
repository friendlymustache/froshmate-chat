class TargetCollege < ActiveRecord::Base
  belongs_to :high_schooler
  belongs_to :college
  has_many :mentor_requests, dependent: :destroy
  has_many :conversations, dependent: :destroy
  validates :high_schooler_id, uniqueness: { scope: :college_id }  
end
