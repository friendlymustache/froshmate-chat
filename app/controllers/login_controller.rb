class LoginController < ApplicationController
	skip_before_action :authorize!, only: [:index]
  	skip_before_action :verify_authenticity_token

	# Used to log a user in via their FB user id
	def index
		fb_user_id = login_params[:fb_user_id]
		access_token = login_params[:access_token]
	    # Check that the provided FB user ID matches the
	    # FB user id that corresponds to the access token
	    if validate_token(access_token, fb_user_id)
	      # Try to log the user in assuming they're a high schooler
	      # and if that fails, try to log them in as a college student
	      @user = HighSchooler.find_by_fb_user_id(fb_user_id) || CollegeStudent.find_by_fb_user_id(fb_user_id)
	      if @user
		      isHighSchooler = (@user.class == HighSchooler)
			  json_user = @user.attributes			  
			  json_user[:isHighSchooler] = isHighSchooler
		      return render json: json_user
		  end
		end
		render json: 'Bad credentials', status: 401
	end

	private
	def login_params
		params.require(:user).permit(:fb_user_id, :access_token)
	end

end
