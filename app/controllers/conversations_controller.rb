class ConversationsController < ApplicationController
	skip_before_action :verify_authenticity_token
	# List all conversations belonging to the current
	# user (defined via params['user_id']) as a student or mentor
	def index
		authenticate_or_request_with_http_token do |token, options|
			render json: Conversation.get_by_token(token), each_serializer: ConversationSparseSerializer			
		end
	end	

	# Show a specific conversation (by ID) with all of its messages
	# (because we're using ConversationSerializer)
	def show
		conversation_id = conversation_params[:id]
		authenticate_or_request_with_http_token do |token, options|
			render json: Conversation.get_single_for_user(token, conversation_id)	
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
