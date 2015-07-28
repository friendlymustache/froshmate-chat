class CollegesController < ApplicationController
  def index
    render json: College.all
  end
end
