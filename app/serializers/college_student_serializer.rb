class CollegeStudentSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :admin
  has_one :college  
  embed :ids, include: true, embed_in_root: true  
end
