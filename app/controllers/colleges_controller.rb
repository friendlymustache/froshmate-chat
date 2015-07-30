class CollegesController < ApplicationController
  skip_before_action :authorize!, only: [:index]
  skip_before_action :verify_authenticity_token
  def index
  	render json: College.all  	
  end

  def for_user
  end
end
