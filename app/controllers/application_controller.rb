class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :authorize!

	def validate_token(access_token, fb_user_id)
	  if Rails.env == "development"
	  	app_key = ENV['DEV_APP_KEY']
	  	app_secret = ENV['DEV_APP_SECRET']
	  else
	  	app_key = ENV['PROD_APP_KEY']
	  	app_secret = ENV['PROD_APP_SECRET']
	  end


	  # Token that validates that the following
	  # token-validation request is coming from our app
	  # See https://developers.facebook.com/docs/facebook-login/access-tokens#apptokens
	  app_access_url = "https://graph.facebook.com/oauth/access_token?client_id=#{app_key}&client_secret=#{app_secret}&grant_type=client_credentials&redirect_uri=none"
	  app_access_token = RestClient.get(app_access_url)
	  app_access_token.slice!("access_token=")

	  # Verify the access token
	  # See https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/v2.4#checktoken
	  validate_token_url = "https://graph.facebook.com/debug_token?input_token=#{access_token}&access_token=#{app_access_token}"
	  auth_response = JSON.parse(RestClient.get(URI.encode(validate_token_url)))
	  token_fb_id = auth_response['data']['user_id']
	  return fb_user_id.to_s == token_fb_id.to_s
	end

  
  private

	def authorize!
	   authenticate_token || render_unauthorized
	end

	def authenticate_token
	  authenticate_with_http_token do |token, options|
	    return CollegeStudent.find_by(auth_token: token) || HighSchooler.find_by(auth_token: token)
	  end
	end

	def render_unauthorized
	  puts "UNAUTHORIZED REQUEST!!!"
	  self.headers['WWW-Authenticate'] = 'Token realm="Application"'
	  render json: 'Bad credentials', status: 401 and return
	end

end
