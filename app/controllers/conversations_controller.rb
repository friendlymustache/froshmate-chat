class ConversationsController < ApplicationController
	skip_before_action :verify_authenticity_token, :authorize!

	# List all conversations belonging to the current
	# user (defined via params['user_id']) as a student or mentor
	def index
		user_id = conversation_params[:user_id]
		render json: Conversation.get_conversations_for_user(user_id), each_serializer: ConversationSparseSerializer
	end	

	# Show a specific conversation (by ID) with all of its messages
	# (because we're using ConversationSerializer)
	def show
		conversation_id = conversation_params[:id]
		authenticate_or_request_with_http_token do |token, options|
			render json: Conversation.get_single_for_user(token, conversation_id)	
		end
	end

	def update
		# Validate that the POST request to create this message was
		# made by the user who's supposedly sending this message
		authenticate_or_request_with_http_token do |token, options|
			user = User.find_by_auth_token(token)
			@message = nil
			if user && message_params[:sender_id] == user.id

				# Get the parent conversation
				conversation = Conversation.find(conversation_params[:id])

				# Create the new message
				@message = conversation.messages.create(message_params)
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

	def conversation_params
		params.permit!
	end	
end
