class HighSchoolerSparseSerializer < ActiveModel::Serializer
  attributes :id, :name
  embed :ids, include: true, embed_in_root: true  
end
