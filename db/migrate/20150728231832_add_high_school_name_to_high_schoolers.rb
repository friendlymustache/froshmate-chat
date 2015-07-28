class AddHighSchoolNameToHighSchoolers < ActiveRecord::Migration
  def change
    add_column :high_schoolers, :high_school_name, :string
  end
end
