class Conversation < ActiveRecord::Base
	has_many :messages, dependent: :destroy
	belongs_to :high_schooler
	belongs_to :college_student
	belongs_to :target_college
	validates :high_schooler_id, uniqueness: {scope: :college_student_id}

	def self.get_by_token(token)
		user =  HighSchooler.find_by_auth_token(token) || CollegeStudent.find_by_auth_token(token)
		if user
			if user.class == HighSchooler
				return Conversation.where(high_schooler_id: user.id)
			end
			return Conversation.where(college_student_id: user.id)
		end
	end

	def self.get_single_for_user(token, conversation_id)
		user = User.find_by_auth_token(token)
		if user
			if user.class == HighSchooler
				return Conversation.where(id: conversation_id, high_schooler_id: user.id).first	
			end	
			return Conversation.where(id: conversation_id, college_student_id: user.id).first
		end
	end
end
