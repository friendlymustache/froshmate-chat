class CollegeStudentMailer < ApplicationMailer
  def welcome_email(user)
    @user = user
    base_url = (Rails.env == "development") ? ENV['DEV_APP_URL'] : ENV['PROD_APP_URL']
    @url = "#{base_url}/\#/confirm/#{@user.confirmation_code}"
    mail(to: @user.email, subject: 'Welcome to Froshmate!')
  end	
end
