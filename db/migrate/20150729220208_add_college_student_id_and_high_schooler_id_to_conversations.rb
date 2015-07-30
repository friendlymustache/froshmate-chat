class AddCollegeStudentIdAndHighSchoolerIdToConversations < ActiveRecord::Migration
  def change
  	remove_column :conversations, :student_id, :integer
  	remove_column :conversations, :mentor_id, :integer
  	add_column :conversations, :high_schooler_id, :integer
  	add_column :conversations, :college_student_id, :integer
  end
end
