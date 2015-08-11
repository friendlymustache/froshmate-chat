class AddMajorAndActivitiesToCollegeStudent < ActiveRecord::Migration
  def change
  	add_column :college_students, :major, :string
  	add_column :college_students, :activities, :string
  end
end
