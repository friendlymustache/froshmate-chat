class TargetCollege < ActiveRecord::Base
  belongs_to :high_schooler
  belongs_to :college
  validates :high_schooler_id, uniqueness: { scope: :college_id }  
end
