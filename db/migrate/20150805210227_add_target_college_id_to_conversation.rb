class AddTargetCollegeIdToConversation < ActiveRecord::Migration
  def change
  	add_column :conversations, :target_college_id, :integer
  end
end
