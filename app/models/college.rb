class College < ActiveRecord::Base
  has_many :high_schoolers, through: target_colleges
  has_many :target_colleges
end
