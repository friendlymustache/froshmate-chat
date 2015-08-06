class HighSchoolersController < ApplicationController
  skip_before_action :verify_authenticity_token
  skip_before_action :authorize!, only: [:create]

  def create
    college_ids = high_schooler_params[:college_ids]
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
        @user = HighSchooler.create!(create_params)
        college_ids.each do |college_id|
          target_college = @user.target_colleges.last
          target_college.mentor_requests.create!(priority: 0)
        end
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
end
