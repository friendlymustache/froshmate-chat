class CollegeStudentSparseSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_one :college  
  embed :ids, include: true, embed_in_root: true  
end
