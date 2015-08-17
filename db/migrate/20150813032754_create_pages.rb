class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.integer :prev_page_id
      t.integer :conversation_id
      t.timestamps null: false
    end

    # Each message belongs to a page
    add_column :messages, :page_id, :integer, null: false

    # Store id of last page so we can fetch it with the
    # conversation
    add_column :conversations, :page_id, :integer, null: false

    # Used to get the total number of message-pages in this
    # conversation for pagination APIs
    add_column :conversations, :num_pages, :integer, default: 1
  end
end
