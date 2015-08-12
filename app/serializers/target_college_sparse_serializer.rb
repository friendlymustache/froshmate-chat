class TargetCollegeSparseSerializer < ActiveModel::Serializer
  attributes :id
  has_one :college
  has_one :high_schooler
  has_many :conversations, serializer: ConversationEdgeSerializer  
  embed :ids, include: true, embed_in_root: true  
end
