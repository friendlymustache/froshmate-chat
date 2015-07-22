require 'rest-client'
class UsersController < ApplicationController
	skip_before_action :verify_authenticity_token
	def create
		access_token = params[:user][:access_token]
		fb_user_id = params[:user][:fb_user_id]
		if validate_token(access_token, fb_user_id)
			puts "Token validated!"
			email = user_params['email']
			@user = User.find_by_email(email)
			# User with the provided email exists, so attempt to
			# log them in (check that their FB user ID matches the
			# FB user id of the access token)
			if @user != nil
				puts "User exists!"
			# User with the provided email doesn't exist, so create
			# a new user with the provided email and FB user ID
			else
				@user = User.create(user_params['user'])
			end
			render json: @user
		else
			render json: {}			
		end
	end	

private
	def user_params
		params.permit(:user, :fb_user_id, :access_token)
	end	

	def validate_token(access_token, fb_user_id)
		# puts "Validating token #{access_token} for fb user id #{fb_user_id}"
		# Token that validates that the following
		# token-validation request is coming from our app
		# See https://developers.facebook.com/docs/facebook-login/access-tokens#apptokens
		app_access_token = RestClient.get("https://graph.facebook.com/oauth/access_token?" + "client_id=125554834447442&client_secret=b29f2dbcffc857e5de21dc7400a6bd85" + "&grant_type=client_credentials&redirect_uri=none")
		app_access_token.slice!("access_token=")

		# Verify the access token
		# See https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/v2.4#checktoken
		validate_token_url = "https://graph.facebook.com/debug_token?input_token=#{access_token}" + "&access_token=#{app_access_token}"
		# puts "Hitting endpoint #{validate_token_url}"
		auth_response = JSON.parse(RestClient.get(validate_token_url))
		token_fb_id = auth_response['data']['user_id']
		puts "Passed in id: #{fb_user_id}, token id: #{token_fb_id}, equal? : #{fb_user_id.to_s == token_fb_id.to_s}"
		return fb_user_id.to_s == token_fb_id.to_s

	end

end
