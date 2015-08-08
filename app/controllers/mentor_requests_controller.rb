class MentorRequestsController < ApplicationController
	skip_before_action :verify_authenticity_token

	def index		
      if validate_admin
      	render json: MentorRequest.all.order(:priority)
      else
      	render json: 'Bad credentials', status: 401
      end
	end

	def update
		'''
		Satisfy a mentor request -- update the mentor request by
		assigning it to a college student, then destroy it.
		'''
		if validate_admin
			request = MentorRequest.find(params[:id])
			target_college = request.target_college
			high_schooler = target_college.high_schooler
			college_student = CollegeStudent.find(mentor_request_params[:college_student_id])
			# Create a new conversation under the target_college edge
			conversation = target_college.conversations.create(high_schooler_id: high_schooler.id, college_student_id: college_student.id)				
       		CollegeStudentMailer.new_match(request, conversation).deliver_later
       		HighSchoolerMailer.new_match(conversation).deliver_later
			render json: request.destroy
		end
	end

	def destroy
	    authenticate_or_request_with_http_token do |token, options|
		  request = MentorRequest.find(params[:id])			    	
	      college_student = CollegeStudent.find_by_auth_token(token)
	      high_schooler = HighSchooler.find_by_auth_token(token)	      
	      # Check if the current user is a college student + admin or
	      # the high schooler who made the current mentor request
	      hs_valid = high_schooler && request.target_college.high_schooler.id == high_schooler.id
	      college_student_valid = college_student && college_student.admin

	      if request && (hs_valid || college_student_valid)
	        render json: request.destroy
	      end
		  return false	
	    end				
	end

private
	def mentor_request_params
		params.require(:mentor_request).permit!
	end

	def validate_admin
      authenticate_or_request_with_http_token do |token, options|
        college_student = CollegeStudent.find_by_auth_token(token)
        if college_student && college_student.admin
          return college_student
        end
	    return false	
      end	
	end
end
