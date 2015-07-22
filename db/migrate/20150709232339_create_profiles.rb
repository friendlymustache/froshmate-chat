class CreateProfiles < ActiveRecord::Migration
  def change
    create_table :profiles do |t|
      t.integer :sat
      t.float :gpa
      t.integer :ethnicity_id
      t.integer :gender_id
      t.float :class_rank

      t.timestamps null: false
    end
  end
end
