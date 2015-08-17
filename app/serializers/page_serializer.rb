class PageSerializer < ActiveModel::Serializer
  attributes :id, :page_id
  # has_many :messages
  embed :ids, include: true, embed_in_root: true

end
