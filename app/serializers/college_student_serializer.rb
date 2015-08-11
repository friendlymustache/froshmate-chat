class CollegeStudentSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :admin, :major, :activities
  has_one :college  
  embed :ids, include: true, embed_in_root: true  
end
