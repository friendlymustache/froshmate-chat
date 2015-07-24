class ConversationSparseSerializer < ActiveModel::Serializer
  attributes :id, :student_id, :mentor_id, :message_ids
  has_one :student
  has_one :mentor
  embed :ids, include: true, embed_in_root: true

  def message_ids
  	object.messages.pluck(:id)
  end

end
