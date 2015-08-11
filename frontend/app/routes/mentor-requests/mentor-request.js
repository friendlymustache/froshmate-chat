import Ember from 'ember';

export default Ember.Route.extend({
	model : function (params) {
		return this.store.find('mentor-request', params.id);
	},

	setupController : function(controller, model) {
		this._super(controller, model);	

		// Get college corresponding to current mentor request
		var college_id = model.get('target_college.college.id');
		var existing_students = model.get('target_college.conversations').getEach('college_student.id');
		var filterer = function(student) {
			var result = student.get('college.id') == college_id && existing_students.indexOf(student.get('id')) == -1;
			return include;
		};

		var college_students = this.store.filter('college-student', {college_id:  college_id}, filterer);
		controller.set('college_students', college_students);
	},
});
