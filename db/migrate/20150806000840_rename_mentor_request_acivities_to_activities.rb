class RenameMentorRequestAcivitiesToActivities < ActiveRecord::Migration
  def change
  	rename_column :mentor_requests, :acivities, :activities
  end
end
