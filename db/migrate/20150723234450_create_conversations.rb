class CreateConversations < ActiveRecord::Migration
  def change
    create_table :conversations do |t|
      t.integer :student_id
      t.integer :mentor_id
      t.boolean :active, :default => true
      t.timestamps null: false
    end
  end
end
