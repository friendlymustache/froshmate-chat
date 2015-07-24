class Conversation < ActiveRecord::Base
	has_many :messages
	belongs_to :student, :class_name => "User"
	belongs_to :mentor, :class_name => "User" 
	def self.get_conversations_for_user(user_id)
		puts "Finding all conversations where the student or mentor id is #{user_id}"
		return Conversation.where("student_id = ? OR mentor_id = ?", user_id, user_id)
	end

	def self.get_single_for_user(token, conversation_id)	
		user = User.find_by_auth_token(token)
		if user
			result = Conversation.where("id = ? AND (student_id = ? OR mentor_id = ?)",
			 conversation_id.to_i, user.id, user.id).first
			puts result
			return result
		end
	end
end
