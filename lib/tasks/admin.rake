namespace :admin do
  task :create => :environment do
  	sid = CollegeStudent.where(email: "smurching@caltech.edu", confirmed: true)
  	if sid.length != 0
		sid = sid.first
  		sid.admin = true
  		sid.save
  		puts "Made Sid an admin"  		
  	else
  		puts "Sid has not signed up yet"
  	end

  	vansh = CollegeStudent.where(email: "vkkumar@caltech.edu", confirmed: true)
  	if vansh.length != 0
		vansh = vansh.first
  		vansh.admin = true
  		vansh.save
  		puts "Made Vansh an admin"
  	else
  		puts "Vansh has not signed up yet"  		
  	end

  	vishal = CollegeStudent.where(email: "vtalasani@uchicago.edu", confirmed: true)
  	if vishal.length != 0
		vishal = vishal.first
  		vishal.admin = true
  		vishal.save
  		puts "Made Vishal an admin"  		
  	else
  		puts "Vishal has not signed up yet"  		
  	end

  end
end
