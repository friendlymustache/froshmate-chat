class MentorRequestSparseSerializer < ActiveModel::Serializer
  attributes :id, :intended_major, :activities, :priority, :created_at
  has_one :target_college
  embed :ids, include: true, embed_in_root: true  
end
