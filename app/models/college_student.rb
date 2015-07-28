class CollegeStudent < ActiveRecord::Base
  belongs_to :college
  belongs_to :high_school
end
