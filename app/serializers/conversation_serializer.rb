class ConversationSerializer < ActiveModel::Serializer
  attributes :id
  has_many :messages
  belongs_to :student, key: :student_id
  belongs_to :mentor, key: :mentor_id
  embed :ids, include: true, embed_in_root: true
end
