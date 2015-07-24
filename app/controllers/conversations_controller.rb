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

private
	def conversation_params
		params.permit!
	end	
end
