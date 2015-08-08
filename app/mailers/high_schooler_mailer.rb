class HighSchoolerMailer < ApplicationMailer
  def welcome_email(user)
    @user = user
	base_url = get_base_url
	@url = "#{base_url}/\#/myaccount/"
	mail(to: @user.email, subject: 'Welcome to Froshmate!')	
  end

  def new_match(conversation)
  	@mentor = conversation.college_student
  	@mentee = conversation.high_schooler
  	@conversation_url = "#{get_base_url}/\#/conversations/#{conversation.id}"
    mail(to: @mentee.email, subject: "Froshmate - new mentor from #{@mentor.college.name}!") 
  end

private

  def get_base_url
  	return (Rails.env == "development") ? ENV['DEV_APP_URL'] : ENV['PROD_APP_URL']
  end


end
