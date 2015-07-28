class SplitUsersIntoHighSchoolersAndCollegeStudents < ActiveRecord::Migration
  def change
    create_table :high_schoolers do |t|
      t.string :name
      t.string :email
      t.string :auth_token
      t.string :fb_user_id

      t.integer :high_school_id

      t.timestamps null: false
    end
    create_table :college_students do |t|
      t.string :name
      t.string :email
      t.string :auth_token
      t.string :fb_user_id

      t.integer :high_school_id
      t.integer :college_id

      t.timestamps null: false
    end
    create_table :high_school do |t|
      t.string :name
    end
    create_table :college do |t|
      t.string :name
    end
    create_table :target_colleges do |t|
      t.integer :high_schooler_id
      t.integer :college_id
    end
    drop_table :users 
  end
end
