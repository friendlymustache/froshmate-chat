class TargetCollegesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
  	'''
  	Renders a list of target colleges + their conversations and mentor requests
  	'''
	authenticate_or_request_with_http_token do |token, options|		
		user = HighSchooler.find_by_auth_token(token)
		if user
			render json: user.target_colleges		
		else
	    	render json: 'Bad credentials', status: 401
		end
	end
  end

  def create
  	user = get_curr_user(target_college_params)
  	if user 
	  	# Create a target college edge between the curent high schooler and
	  	# their desired college, if necessary
	  	target_college = TargetCollege.find_or_create_by(college_id: target_college_params[:college_id],
	  		high_schooler_id: target_college_params[:high_schooler_id])

		# Build a hash of properties for our new mentor request
		mentor_request = target_college_params[:mentor_requests][0].permit(:intended_major, :activities)

	  	# Priority = number of conversations user is involved in in general
	  	mentor_request[:priority] = user.conversations.length

	  	existing_requests = target_college.mentor_requests

	  	# Only allow one request at a time - if there is no existing request
	  	# for this high schooler - college pair, create a new request.
	  	if existing_requests.length == 0
		  	# Create the new mentor request under the target college
		  	existing_requests.create(mentor_request)  	
		# Otherwise, update the existing mentor request
		else
			existing_requests.first.update_attributes(mentor_request)
	  	end
  		render json: target_college
  	else
	    render json: 'Bad credentials', status: 401  		
  	end

  end

private
	def target_college_params
		params.require(:target_college).permit!
	end

    def get_curr_user(params)
      authenticate_or_request_with_http_token do |token, options|
        high_schooler = HighSchooler.find_by_auth_token(token)
        if high_schooler && high_schooler.id = params[:high_schooler_id].to_i
          return high_schooler
        end
      end      
    end	

end
