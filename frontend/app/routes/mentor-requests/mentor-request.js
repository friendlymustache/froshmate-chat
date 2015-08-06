import Ember from 'ember';

export default Ember.Route.extend({
	model : function (params) {
		return this.store.find('mentor-request', params.id);
	},

	setupController : function(controller, model) {
		this._super(controller, model);
		
		var filtered_students = new Ember.RSVP.Promise(function(resolve, reject) {

			// Get college corresponding to current mentor request
			var curr_request_college = model.get('target_college.college');
			var existing_students = model.get('target_college.conversations').getEach('college_student.id');

			var college_students = this.store.find('college-student', {college_id:  curr_request_college.get('id')});
			
			var filterer = function(students) {
				var filtered_students = students.filter(function(student) {
					debugger;
					return existing_students.indexOf(student.get('id')) == -1;
				});
				resolve(filtered_students);
			};			
			college_students.then(filterer).catch(function() {reject(); });
		});
		controller.set('college_students', filtered_students);
	},
});
