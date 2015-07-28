class AddSentByHighSchoolerToMessage < ActiveRecord::Migration
  def change
    add_column :messages, :sent_by_high_schooler, :bool
  end
end
