class Page < ActiveRecord::Base
	# validate :within_capacity
	belongs_to :page
	has_many :messages, dependent: :destroy
	belongs_to :conversation

	# Disable this validation so it doesn't break stuff in production
	# def within_capacity
	# 	"""
	# 	Validate that the page isn't overflowing
	# 	"""
	# 	return self.messages.length <= 10
	# end

	def self.messages_with_token(page_id, token)
		# Check that there is a user with the current access token
		user = HighSchooler.find_by_auth_token(token) || CollegeStudent.find_by_auth_token(token)
		if user
			# Check that the user is one of the participants in the current conversation
			page = Page.find(page_id)
			if user.class == HighSchooler && page && page.conversation.high_schooler_id == user.id
				return page.messages
			elsif page && page.conversation.college_student_id == user.id
				return page.messages
			end
		end
		return nil
	end	


end
