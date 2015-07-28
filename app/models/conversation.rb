class Conversation < ActiveRecord::Base
	has_many :messages
	belongs_to :high_schooler
	belongs_to :college_student

	def self.get_single_for_user(token, conversation_id)
		user = User.find_by_auth_token(token)
		if user
			result = Conversation.where("id = ? AND (student_id = ? OR mentor_id = ?)",
			 conversation_id.to_i, user.id, user.id).first
			return result
		end
	end
end
