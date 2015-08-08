import Ember from 'ember';

export default Ember.Controller.extend({
	college_student : undefined,
	needs : "mentor-requests",
	mentor_selected : function() {
		return this.get('college_student') !== undefined;
	}.property('college_student'),

	actions : {
		deny_request : function() {
			var model = this.get('model');
			this.store.deleteRecord(model);
			model.save().then(function(result) {
				var ids = this.get('controllers.mentor-requests.model').getEach('id');
				if (ids.length != 0) {
					this.transitionToRoute('mentor_requests.mentor_request', ids[0]);
				}
				else {
					this.transitionToRoute('index');
				}
			}.bind(this))
		},

		approve_request : function() {
			var college_student = this.get('college_student');
			var model = this.get('model');
			model.set('college_student', college_student);		
			model.save().then(function(result) {
				// Remove current request from the store (it's already been deleted
				// on the backend)
				this.store.deleteRecord(model);
				// Get all the remaining request ids
				var ids = this.get('controllers.mentor-requests.model').getEach('id');				
				if (ids.length != 0) {
					this.transitionToRoute('mentor_requests.mentor_request', ids[0]);
				}
				else {
					this.transitionToRoute('index');
				}				
			}.bind(this));
		},

		set_mentor : function(mentor) {
			this.set('college_student', mentor);
		}
	}
});
