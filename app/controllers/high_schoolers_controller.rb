class HighSchoolersController < ApplicationController
  skip_before_action :verify_authenticity_token
  skip_before_action :authorize!, only: [:create]

  def create
    college_ids = high_schooler_params[:college_ids]
    puts "Colleg IDS: #{college_ids}"
    access_token = high_schooler_params[:access_token]
    fb_user_id = high_schooler_params[:fb_user_id]
    create_params = high_schooler_params.except(:access_token)
    # Check that the provided FB user ID matches the
    # FB user id that corresponds to the access token
    if validate_token(access_token, fb_user_id)
      fb_user_id = high_schooler_params['fb_user_id']
      @user = HighSchooler.find_by_fb_user_id(fb_user_id)
      # User with the provided FB user id doesn't exist, so create
      # a new user
      if @user == nil
        @user = HighSchooler.create(create_params)
      end
      render json: @user
    else
      render json: 'Bad credentials', status: 401
    end
  end

  def show
      high_schooler = get_curr_user(params)
      render json: high_schooler and return if high_schooler
      render json: 'Bad credentials', status: 401
  end

  def update
    high_schooler = get_curr_user(params)
    if high_schooler
      high_schooler.update_attributes(update_params)
      college_ids = high_schooler_params[:college_ids]
      college_ids.each do |id|
        TargetCollege.create(college_id: id, high_schooler_id: high_schooler.id)
      end
      render json: high_schooler
    else
      render json: 'Bad credentials', status: 401
    end
  end

  private

    def get_curr_user(params)
      authenticate_or_request_with_http_token do |token, options|
        high_schooler = HighSchooler.find_by_auth_token(token)
        if high_schooler && high_schooler.id = params[:id].to_i
          return high_schooler
        end
      end      
    end

    def high_schooler_params
      params.require(:high_schooler).permit(:email, :fb_user_id, :access_token, :name, :high_school_name, :college_ids => [])
    end

    def update_params
      params.require(:high_schooler).permit(:email, :name, :high_school_name)      
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
