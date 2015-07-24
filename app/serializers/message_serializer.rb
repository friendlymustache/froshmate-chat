class MessageSerializer < ActiveModel::Serializer
  attributes :id, :text, :sender_id, :recipient_id
  embed :ids, include: true, embed_in_root: true
end
