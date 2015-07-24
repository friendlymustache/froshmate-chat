class AddFbUserIdAndAcessTokenToUser < ActiveRecord::Migration
  def change
  	add_column :users, :auth_token, :string
  	add_column :users, :fb_user_id, :string
  	add_column :users, :name, :string
  end
end
