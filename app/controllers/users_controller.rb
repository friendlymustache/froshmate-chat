require 'rest-client'
class UsersController < ApplicationController
	skip_before_action :verify_authenticity_token	
	skip_before_action :authorize!, only: [:create]
	def create
		access_token = user_params[:access_token]
		fb_user_id = user_params[:fb_user_id]
		create_params = user_params.except(:access_token)

		# Check that the provided FB user ID matches the
		# FB user id that corresponds to the access token
		if validate_token(access_token, fb_user_id)
			email = user_params['email']
			@user = User.find_by_email(email)
			# User with the provided email doesn't exist, so create
			# a new user
			if @user == nil
				@user = User.create(create_params)
			end
			render json: @user.to_json
		else
			render json: {}			
		end
	end	

	def index
		puts "Made it to this endpoint, yay ^_^"
		render json: {}
	end

private
	def user_params
		params.require(:user).permit(:email, :fb_user_id, :access_token, :name)
	end	

	def validate_token(access_token, fb_user_id)
		# Token that validates that the following
		# token-validation request is coming from our app
		# See https://developers.facebook.com/docs/facebook-login/access-tokens#apptokens
		app_access_token = RestClient.get("https://graph.facebook.com/oauth/access_token?" + "client_id=125554834447442&client_secret=b29f2dbcffc857e5de21dc7400a6bd85" + "&grant_type=client_credentials&redirect_uri=none")
		app_access_token.slice!("access_token=")

		# Verify the access token
		# See https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/v2.4#checktoken
		validate_token_url = "https://graph.facebook.com/debug_token?input_token=#{access_token}" + "&access_token=#{app_access_token}"
		auth_response = JSON.parse(RestClient.get(validate_token_url))
		token_fb_id = auth_response['data']['user_id']
		return fb_user_id.to_s == token_fb_id.to_s

	end

end
