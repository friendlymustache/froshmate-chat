class Message < ActiveRecord::Base
	belongs_to :page	

	def self.find_by_token(auth_token, id)
		user = (CollegeStudent.find_by_auth_token(auth_token) || HighSchooler.find_by_auth_token(auth_token))
		# Verifies that user exists
		if user
			if user.class == HighSchooler
				return Message.where(sender_id: user.id, id: id, sent_by_high_schooler: true).first || Message.where(recipient_id: user.id, id: id, sent_by_high_schooler: false).first
			end
			return Message.where(sender_id: user.id, id: id, sent_by_high_schooler: false).first || Message.where(recipient_id: user.id, id: id, sent_by_high_schooler: true).first
		end
	end
end
