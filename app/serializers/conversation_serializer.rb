class ConversationSerializer < ActiveModel::Serializer
  '''
  Serializes the messages and participants of a conversation in 
  full detail. Good for displaying details of an individual
  conversation
  '''
  attributes :id
  has_one :page
  has_one :high_schooler
  has_one :college_student
  embed :ids, include: true, embed_in_root: true
end
