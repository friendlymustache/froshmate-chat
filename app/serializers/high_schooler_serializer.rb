class HighSchoolerSerializer < ActiveModel::Serializer
  attributes :id, :email, :name
  has_many :target_colleges
  has_many :conversations, serializer: ConversationEdgeSerializer
  
  embed :ids, include: true, embed_in_root: true  
end
