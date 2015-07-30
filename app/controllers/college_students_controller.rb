class CollegeStudentsController < ApplicationController
  skip_before_action :verify_authenticity_token
  skip_before_action :authorize!, only: [:create, :index]

  def index
    render json: CollegeStudent.all
  end

  def create
    access_token = college_student_params[:access_token]
    fb_user_id = college_student_params[:fb_user_id]
    create_params = college_student_params.except(:access_token)

    # Check that the provided FB user ID matches the
    # FB user id that corresponds to the access token
    if validate_token(access_token, fb_user_id)
      email = college_student_params['email']
      @user = CollegeStudent.find_by_fb_user_id(fb_user_id)
      # User with the provided email doesn't exist, so create
      # a new user
      if @user == nil
        @user = CollegeStudent.create(create_params)
      end
      render json: @user
    else
      render json: {}
    end
  end

  def show
    college_student = get_curr_user(params)
    render json: college_student and return if college_student
    render json: 'Bad credentials', status: 401
  end


  def update
    college_student = get_curr_user(params)
    if college_student
      college_student.update_attributes(update_params)
      render json: college_student
    else
      render json: 'Bad credentials', status: 401
    end
  end

  private
    def college_student_params
      params.require(:college_student).permit(:email, :fb_user_id, :access_token, :name, :college_id)
    end

    def update_params
      params.require(:college_student).permit(:email, :name, :college)      
    end

    def get_curr_user(params)
      authenticate_or_request_with_http_token do |token, options|
        college_student = CollegeStudent.find_by_auth_token(token)
        if college_student && college_student.id = params[:id].to_i
          return college_student
        end
      end      
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
