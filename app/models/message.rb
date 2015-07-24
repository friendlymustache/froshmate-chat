class Message < ActiveRecord::Base
	belongs_to :conversation
	belongs_to :sender, class_name: "User"
	belongs_to :recipient, class_name: "User"
	def self.find_by_token(auth_token, id)
		user = User.find_by_auth_token(auth_token)
		if user
			return Message.where("(sender_id = ? OR recipient_id = ?) AND id = ?", user.id, user.id, id)
		end
	end
end
