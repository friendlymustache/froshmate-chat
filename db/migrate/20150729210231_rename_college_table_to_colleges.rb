class RenameCollegeTableToColleges < ActiveRecord::Migration
  def change
  	rename_table :college, :colleges
  end
end
