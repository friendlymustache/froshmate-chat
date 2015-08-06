class CreateMentorRequests < ActiveRecord::Migration
  def change
    create_table :mentor_requests do |t|
      t.integer :priority
      t.integer :target_college_id
      t.string :intended_major
      t.string :acivities

      t.timestamps null: false
    end
  end
end
