class College < ActiveRecord::Base
	has_many :college_students
	validates :name, uniqueness: true
end
