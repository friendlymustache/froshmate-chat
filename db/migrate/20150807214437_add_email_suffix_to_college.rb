class AddEmailSuffixToCollege < ActiveRecord::Migration
  def change
  	add_column :colleges, :email_suffix, :string
  end
end
