class MentorRequestSerializer < ActiveModel::Serializer
  attributes :id, :intended_major, :activities, :priority, :created_at
  has_one :target_college, serializer: TargetCollegeSparseSerializer
  embed :ids, include: true, embed_in_root: true  
end
