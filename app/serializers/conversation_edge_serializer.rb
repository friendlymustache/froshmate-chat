class ConversationEdgeSerializer < ActiveModel::Serializer
  '''
  Serializes just the high schooler and college student names 
  for the current conversation (no message info at all)

  Useful for rendering edges to describing connections/conversations
  between high schoolers and college students.
  '''
  attributes :id
  has_one :target_college, serializer: TargetCollegeSparseSerializer
  has_one :high_schooler, serializer: HighSchoolerSparseSerializer
  has_one :college_student, serializer: CollegeStudentSparseSerializer
  embed :ids, include: true, embed_in_root: true
end
