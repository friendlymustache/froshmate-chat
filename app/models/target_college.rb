class TargetCollege < ActiveRecord::Base
  belongs_to :high_schooler
  belongs_to :college
  has_many :mentor_requests
  has_many :conversations
  validates :high_schooler_id, uniqueness: { scope: :college_id }  
end
