class Conversation < ActiveRecord::Base
	has_many :pages, dependent: :destroy
	# Page referenced by page_id = last page
	belongs_to :page
	belongs_to :high_schooler
	belongs_to :college_student
	belongs_to :target_college
	validates :high_schooler_id, uniqueness: {scope: :college_student_id}

	def self.all_by_token(token)
		user =  HighSchooler.find_by_auth_token(token) || CollegeStudent.find_by_auth_token(token)
		if user
			if user.class == HighSchooler
				return Conversation.where(high_schooler_id: user.id)
			end
			return Conversation.where(college_student_id: user.id)
		end
	end

	def self.find_by_token(token, conversation_id)
		user =  HighSchooler.find_by_auth_token(token) || CollegeStudent.find_by_auth_token(token)
		if user
			if user.class == HighSchooler
				return Conversation.where(id: conversation_id, high_schooler_id: user.id).first	
			end	
			return Conversation.where(id: conversation_id, college_student_id: user.id).first
		end
	end
end
