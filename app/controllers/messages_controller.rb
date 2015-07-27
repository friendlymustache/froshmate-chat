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
			user = User.find_by_auth_token(token)
			@message = nil
			if user && message_params[:sender_id] == user.id
				@message = Message.create(message_params)
				recipient = User.find(message_params[:recipient_id])
				if recipient == nil
					puts "Couldn't find recipient"
				else
					puts "Found recipient successfully"
				end
				recipient_auth_token = recipient.auth_token
    			$redis.publish "rt-change/#{recipient_auth_token}", @message.to_json
				puts "Creating message with params: #{message_params}"    			
			end
			render json: @message
		end
	end

private
	def message_params
		params.require(:message).permit(:sender_id, :recipient_id, :text, :conversation_id)
	end


end
