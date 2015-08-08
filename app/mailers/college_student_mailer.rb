class CollegeStudentMailer < ApplicationMailer
  def welcome_email(user)
    @user = user
    base_url = get_base_url
    @url = "#{base_url}/\#/confirm/#{@user.confirmation_code}"
    mail(to: @user.email, subject: 'Welcome to Froshmate!')
  end	

  def new_match(mentor_request, conversation)
  	@mentor = conversation.college_student
  	@mentor_request = mentor_request
  	@mentee = conversation.high_schooler
  	@conversation_url = "#{get_base_url}/\#/conversations/#{conversation.id}"
    mail(to: @mentor.email, subject: "Froshmate - new mentee!")   	
  end

private

  def get_base_url
  	return (Rails.env == "development") ? ENV['DEV_APP_URL'] : ENV['PROD_APP_URL']
  end


end
