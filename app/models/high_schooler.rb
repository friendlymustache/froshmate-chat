class HighSchooler < ActiveRecord::Base
  has_many :colleges, through: :target_colleges
  has_many :target_colleges
  belongs_to :high_school
end
