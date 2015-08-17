class RenamePrevPageIdToPageIdInPagesTable < ActiveRecord::Migration
  def change
  	rename_column :pages, :prev_page_id, :page_id
  end
end
