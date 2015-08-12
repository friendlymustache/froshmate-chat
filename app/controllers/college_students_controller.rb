class CollegeStudentsController < ApplicationController
  skip_before_action :verify_authenticity_token
  skip_before_action :authorize!, only: [:create, :confirm]

  def index
    college = College.find(params[:college_id])
    render json: college.college_students.where(confirmed: true)
  end

  def confirm
    confirmation_code = params[:confirmation_code]
    student = CollegeStudent.find_by_confirmation_code(confirmation_code)
    if student
      student.confirmed = true
      student.save!
      render json: student
    else
      render json: 'Bad request', status: 401
    end
  end

  def create
    access_token = college_student_params[:access_token]
    fb_user_id = college_student_params[:fb_user_id]
    create_params = college_student_params.except(:access_token)

    # Check that the provided FB user ID matches the
    # FB user id that corresponds to the access token
    if validate_token(access_token, fb_user_id)
      puts "Validated!"
      email = college_student_params[:email].gsub(/,/, "")
      @user = CollegeStudent.find_by_fb_user_id(fb_user_id)
      # User with the provided email doesn't exist, so create
      # a new user
      if @user == nil && email_valid(college_student_params[:college_id], college_student_params[:email])
        @user = CollegeStudent.create(create_params)
        CollegeStudentMailer.welcome_email(@user).deliver_later
      end
      render json: @user
    else
      render json: 'Bad credentials', status: 401
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
    def email_valid(college_id, email)
      email_validator = Regexp.new("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")      
      regex = Regexp.new(College.find(college_id).email_suffix)
      return regex.match(email) && email_validator.match(email)
    end

    def college_student_params
      params.require(:college_student).permit(:email, :fb_user_id, :access_token, :name, :college_id, :major, :activities)
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
end
