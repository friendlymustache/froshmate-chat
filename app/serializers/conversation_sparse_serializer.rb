class ConversationSparseSerializer < ActiveModel::Serializer
  '''
  Contains the participant info but not the message info of a conversation.
  Useful for displaying a list of conversations
  '''
  attributes :id, :high_schooler_id, :college_student_id, :message_ids
  has_one :high_schooler, serializer: HighSchoolerSparseSerializer
  has_one :college_student, serializer: CollegeStudentSparseSerializer
  embed :ids, include: true, embed_in_root: true

  def message_ids
  	object.messages.pluck(:id)
  end

end
