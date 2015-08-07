class AddConfirmedAndConfirmationCodeToCollegeStudent < ActiveRecord::Migration
  def change
  	add_column :college_students, :confirmation_code, :string
  	add_column :college_students, :confirmed, :bool, default: false
  end
end
