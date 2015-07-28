class TargetCollege < ActiveRecord::Base
  belongs_to :high_schooler
  belongs_to :college
end
