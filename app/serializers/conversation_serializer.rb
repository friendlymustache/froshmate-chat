class ConversationSerializer < ActiveModel::Serializer
  attributes :id
  has_many :messages
  has_one :high_schooler
  has_one :college_student
  embed :ids, include: true, embed_in_root: true
end
