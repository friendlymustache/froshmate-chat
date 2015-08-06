class AddAdminToCollegeStudent < ActiveRecord::Migration
  def change
  	add_column :college_students, :admin, :bool, :default => false
  end
end
