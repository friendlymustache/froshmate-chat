class ConversationSerializer < ActiveModel::Serializer
  attributes :id
  has_many :messages
  belongs_to :high_schooler
  belongs_to :college_student
  embed :ids, include: true, embed_in_root: true
end
