class HighSchoolerSerializer < ActiveModel::Serializer
  attributes :id, :email, :name
  has_many :colleges  
  embed :ids, include: true, embed_in_root: true  
end
