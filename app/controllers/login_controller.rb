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

    def validate_token(access_token, fb_user_id)
      # Token that validates that the following
      # token-validation request is coming from our app
      # See https://developers.facebook.com/docs/facebook-login/access-tokens#apptokens
      app_access_token = RestClient.get('https://graph.facebook.com/oauth/access_token?client_id=125554834447442&client_secret=b29f2dbcffc857e5de21dc7400a6bd85&grant_type=client_credentials&redirect_uri=none')
      app_access_token.slice!("access_token=")

      # Verify the access token
      # See https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/v2.4#checktoken
      validate_token_url = "https://graph.facebook.com/debug_token?input_token=#{access_token}&access_token=#{app_access_token}"
      auth_response = JSON.parse(RestClient.get(URI.encode(validate_token_url)))
      token_fb_id = auth_response['data']['user_id']
      return fb_user_id.to_s == token_fb_id.to_s

    end

end
