class MessageSerializer < ActiveModel::Serializer
  attributes :id, :text, :sender_id, :recipient_id, :created_at
  embed :ids, include: true, embed_in_root: true
end
