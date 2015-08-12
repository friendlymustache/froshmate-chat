class MessagesController < ApplicationController
	skip_before_filter :verify_authenticity_token
	def show
		message_id = params[:id]
		authenticate_or_request_with_http_token do |token, options|
			render json: Message.find_by_token(token, message_id)
		end		
	end

	def create
		# Validate that the POST request to create this message was
		# made by the user who's supposedly sending this message
		authenticate_or_request_with_http_token do |token, options|
			sender = (CollegeStudent.find_by_auth_token(token) || HighSchooler.find_by_auth_token(token))
			@message = nil
			if sender && message_params[:sender_id] == sender.id
				# Create the new message
				@message = Message.create(message_params)

				if sender.class == HighSchooler
					recipient = CollegeStudent.find(message_params[:recipient_id])
				else
					recipient = HighSchooler.find(message_params[:recipient_id])
				end

				recipient_auth_token = recipient.auth_token
    			$redis.publish "rt-change/#{recipient_auth_token}", @message.to_json
			end
			render json: @message
		end
	end

private
	def message_params
		params.require(:message).permit(:sender_id, :recipient_id, :text, :conversation_id, :sent_by_high_schooler)
	end


end
