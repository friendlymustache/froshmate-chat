class ConversationsController < ApplicationController
	skip_before_action :verify_authenticity_token
	# List all conversations belonging to the current
	# user (defined via params['user_id']) as a student or mentor
	def index
		authenticate_or_request_with_http_token do |token, options|
			render json: Conversation.all_by_token(token), each_serializer: ConversationSparseSerializer			
		end
	end	

	def update
		authenticate_or_request_with_http_token do |token, options|					
			conversation = Conversation.find_by_token(token, params[:id])

			# Assert that the page we're using as the "previous page" of
			# the page we're about to create belongs to the same conversation
			prev_page = Page.find(add_new_page_params[:page][:page_id])
			if prev_page.conversation == conversation
				new_page = Page.create(page_id: prev_page.id, conversation_id: conversation.id)
			end

			conversation.page_id = new_page.id
			conversation.num_pages = add_new_page_params[:num_pages]
			conversation.save
			render json: conversation
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
	def add_new_page_params
		params.require(:conversation).permit(:num_pages, page: [:page_id] )
	end

	def message_params
		params.require(:message).permit(:sender_id, :recipient_id, :text, :conversation_id)
	end

	def conversation_params
		params.permit!
	end	
end
